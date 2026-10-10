import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, MessageSquare, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default async function BuyerDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const authObj = await auth();
  if (!authObj.userId) return null;

  const rfqs = await prisma.rFQ.findMany({
    where: { buyerId: authObj.userId },
    include: { _count: { select: { quotations: true } } }
  });

  const activeRfqs = rfqs.filter(r => r.status === 'OPEN').length;
  const totalQuotes = rfqs.reduce((acc, r) => acc + r._count.quotations, 0);

  const unreadMessages = await prisma.message.count({
    where: {
      conversation: { buyerId: authObj.userId },
      senderId: { not: authObj.userId },
      isRead: false
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sourcing Dashboard</h1>
        <p className="text-slate-500 mt-1">Track your requests and manage factory negotiations.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Active RFQs</CardTitle>
            <FileText className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">{activeRfqs}</div>
            <p className="text-xs text-slate-400 mt-1">Sourcing requests open for bidding</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Quotes Received</CardTitle>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">{totalQuotes}</div>
            <p className="text-xs text-slate-400 mt-1">Across all your RFQs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">Unread Messages</CardTitle>
            <MessageSquare className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">{unreadMessages}</div>
            <p className="text-xs text-slate-400 mt-1">From factory owners</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 text-white border-none">
          <CardContent className="p-8 space-y-4">
            <h3 className="text-xl font-bold">Need a new product?</h3>
            <p className="text-slate-400 text-sm">Broadcast your requirements to hundreds of verified Egyptian factories instantly.</p>
            <Link href={`/${locale}/marketplaces/matchmaking`} className="inline-block bg-white text-slate-900 px-6 py-2 rounded-md font-bold text-sm hover:bg-slate-100 transition-colors">
              Post new RFQ
            </Link>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-8 space-y-4">
            <h3 className="text-xl font-bold text-blue-900">Review your quotes</h3>
            <p className="text-blue-700/70 text-sm">You have pending bids from factories. Review them and close the deal!</p>
            <Link href={`/${locale}/dashboard/buyer/rfqs`} className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md font-bold text-sm hover:bg-blue-700 transition-colors">
              Manage RFQs
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
