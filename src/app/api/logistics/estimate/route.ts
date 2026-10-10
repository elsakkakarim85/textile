import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { weightKg, volumeCbm, destination } = await req.json();

    // Mock Freight Calculation Logic
    let baseRatePerCbm = 0;
    let days = "";

    switch (destination.toLowerCase()) {
      case 'europe':
        baseRatePerCbm = 120; // USD
        days = "12-15 days";
        break;
      case 'usa':
        baseRatePerCbm = 250;
        days = "25-30 days";
        break;
      case 'gcc':
        baseRatePerCbm = 80;
        days = "5-7 days";
        break;
      default:
        baseRatePerCbm = 150;
        days = "15-20 days";
    }

    // Cost by Volume vs Weight (standard logistics rule: 1 CBM = ~167 kg for air, but let's do ocean freight standard)
    const oceanCost = Math.max(volumeCbm, weightKg / 1000) * baseRatePerCbm;
    
    // Add some random fees
    const customsClearance = 150;
    const documentFee = 50;
    
    const totalCostUsd = oceanCost + customsClearance + documentFee;

    return NextResponse.json({
      success: true,
      data: {
        oceanFreight: oceanCost.toFixed(2),
        customs: customsClearance.toFixed(2),
        docs: documentFee.toFixed(2),
        totalUsd: totalCostUsd.toFixed(2),
        estimatedTransitTime: days,
        portOfLoading: "Alexandria, Egypt"
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to calculate freight' }, { status: 500 });
  }
}
