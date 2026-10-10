import { generateText, embed } from 'ai';
import { google } from '@ai-sdk/google';
import { getPineconeIndex } from '@/lib/pinecone';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { search, SafeSearchType } from 'duck-duck-scrape';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessageObj = messages[messages.length - 1];
    const lastMessage = lastMessageObj.content;

    let contextText = '';
    
    // Prisma RAG: Fetch actual marketplace data
    try {
      
      const factories = await prisma.factory.findMany({
        where: { isVerified: true },
        include: {
          owner: {
            include: { listings: true }
          }
        },
        take: 10
      });

      if (factories && factories.length > 0) {
        contextText = factories.map((f: any) => {
          const products = f.owner.listings.map((l: any) => `- ${l.title} (${l.price} ${l.currency})`).join('\n');
          return `Factory: ${f.name} (Address: ${f.address})\nProducts:\n${products}\nLink: /factories/${f.id}`;
        }).join('\n\n---\n\n');
      }
    } catch (error) {
      console.error('Prisma RAG failed.', error);
    }

    // Mock RAG: Inject Document Analysis from Google Drive PDFs
    const docAnalysis = `
    ### تحليل مستندات التصدير - تقرير الجودة الشامل (المراجع من Google Drive)
    معايير الجودة الأساسية لتصدير المنسوجات من تكتل المحلة (يجب سردها في الإجابة):
    
    1. **المواصفات الفيزيائية (Physical Properties):**
       - **ثبات اللون (Color Fastness):** يجب أن تكون درجة ثبات اللون للاحتكاك (الغسيل، العرق، والضوء) مطابقة لمعايير ISO 105. يمنع استخدام صبغات الآزو (Azo Dyes) المحظورة عالمياً وخاصة في الاتحاد الأوروبي (REACH regulations).
       - **قوة الشد (Tensile Strength):** وفقاً لمعايير ASTM D5034-09، يجب أن تتحمل الأقمشة المصدرة إجهاداً لا يقل عن 250 نيوتن للأقمشة المنسوجة (Woven fabrics).
       - **معدل الانكماش (Shrinkage Rate):** لا يتجاوز 3-5% كحد أقصى بعد 5 غسلات عند درجة حرارة 40 مئوية (طبقاً لمواصفة AATCC 135).
       - **عدد الخيوط والكثافة (Thread Count & GSM):** يجب أن تتطابق كثافة النسيج والوزن بالمتر المربع (GSM) مع العينة المعتمدة (Tolerance +/- 5%).
       
    2. **المعايير الكيميائية والبيئية (Chemical & Environmental Standards):**
       - **خلو من المواد الضارة:** خلو الأقمشة من الفورمالديهايد (Formaldehyde)، المعادن الثقيلة (Heavy Metals)، والفثالات (Phthalates) طبقاً لمعيار OEKO-TEX Standard 100.
       - **إدارة مياه الصرف:** المصانع المصدرة يجب أن تمتلك شهادات معالجة مياه الصرف (Zero Liquid Discharge) للحفاظ على الاستدامة البيئية.
       
    3. **التعبئة والتغليف (Packaging & Labeling):**
       - **بطاقات البيانات (Labels):** يجب أن تتضمن نسبة الخلط (مثل: 100% قطن مصري)، تعليمات الغسيل الدولية (Care Symbols)، بلد المنشأ (Made in Egypt)، ورقم تسجيلي ضريبي للمصنع.
       - **التغليف الخارجي:** التغليف في أكياس بولي إيثيلين مقواة لضمان حماية المنسوجات من الرطوبة أثناء الشحن البحري، مع إدراج أكياس السيليكا (Silica Gel).
    `;
    contextText += `\n\n--- Document Analysis (Google Drive PDFs) ---\n\n${docAnalysis}`;

    // Live Web Search for up-to-date data
    try {
      
      const searchResults = await search(lastMessage, {
        safeSearch: SafeSearchType.OFF
      });
      if (searchResults.results && searchResults.results.length > 0) {
        const topResults = searchResults.results.slice(0, 3).map((r: any) => `- **${r.title}**: ${r.description} (Source: ${r.url})`).join('\n');
        contextText += `\n\n--- Live Web Search Results (Up-to-date Data) ---\n\n${topResults}`;
      }
    } catch (searchError) {
      console.error('Web search failed.', searchError);
    }

    const systemPrompt = `أنت مستشار ذكي ومندوب توريد لتكتل المحلة للنسيج (El Mahalla Textile Cluster).
    تتحدث باللغة العربية. هدفك هو مساعدة أصحاب المصانع، العمال، والموردين.
    
    [تعليمات صارمة للتنسيق - يجب الالتزام بها]:
    - لا تقم بكتابة نصوص عادية متصلة أبداً. يجب أن تنسق ردك كتقرير احترافي.
    - استخدم العناوين الكبيرة (Heading 1) مثل: # عنوان التقرير.
    - استخدم الجداول (Markdown Tables) لعرض المعايير والمقاسات.
    - استخدم النقاط (Bullet points) لسرد التفاصيل.
    - تجنب تكرار نفس الجملة. كن دقيقاً، مفصلاً، واحترافياً.
    
    هذه معلومات من قواعد البيانات وتحليل مستندات التصدير (PDFs):
    ${contextText ? contextText : 'لا توجد بيانات متاحة حالياً.'}
    
    يجب أن تبني ردك التفصيلي والمنسق بالكامل بناءً على هذه المعايير (مستندات التصدير) المذكورة أعلاه.`;

    if (!process.env.GROQ_API_KEY) {
       return NextResponse.json({ text: "عذراً، يجب توفير مفتاح GROQ_API_KEY." });
    }

    const { createGroq } = require('@ai-sdk/groq');
    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
    
    const coreMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.content
    }));

    const result = await generateText({
      model: groq('qwen/qwen3.8-27b'),
      system: systemPrompt,
      messages: coreMessages,
      temperature: 0.3,
      frequencyPenalty: 0.5,
    });

    return NextResponse.json({ text: result.text });
  } catch (error: any) {
    console.error('Route error:', error);
    return NextResponse.json({ text: "حدث خطأ في الاتصال بالذكاء الاصطناعي. يرجى المحاولة لاحقاً." }, { status: 500 });
  }
}
