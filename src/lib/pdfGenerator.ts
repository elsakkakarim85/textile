import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportContractPdf = (contract: any) => {
  const doc = new jsPDF();
  
  // Platform Logo / Header
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235); // primary blue
  doc.text('MAHALLA CLUSTER', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Egypt\'s Premier B2B Textile Network', 14, 30);
  doc.text('www.mahalla-cluster.com', 14, 35);

  // Contract Title
  doc.setFontSize(18);
  doc.setTextColor(20, 20, 20);
  doc.text('OFFICIAL ESCROW CONTRACT', 14, 50);

  // Contract Details
  doc.setFontSize(11);
  doc.text(`Contract ID: ${contract.id}`, 14, 60);
  doc.text(`Date Issued: ${new Date(contract.createdAt).toLocaleDateString()}`, 14, 66);
  doc.text(`Status: ${contract.status}`, 14, 72);
  
  // Parties
  doc.setFontSize(14);
  doc.text('Parties Involved', 14, 85);
  
  doc.setFontSize(11);
  doc.text('BUYER:', 14, 93);
  doc.text(`Name: ${contract.buyer.firstName || 'Verified'} ${contract.buyer.lastName || 'Buyer'}`, 20, 100);
  doc.text(`Email: ${contract.buyer.email}`, 20, 106);

  doc.text('FACTORY / SELLER:', 110, 93);
  doc.text(`Company: ${contract.factory.name}`, 116, 100);
  doc.text(`Tax ID: ${contract.factory.taxRegistrationNumber}`, 116, 106);
  doc.text(`Address: ${contract.factory.address}`, 116, 112);

  // Milestones Table
  doc.setFontSize(14);
  doc.text('Payment Milestones', 14, 125);

  const tableBody = contract.milestones.map((m: any, index: number) => [
    `Milestone ${index + 1}`,
    m.title,
    m.status,
    `EGP ${m.amount.toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 130,
    head: [['Phase', 'Description', 'Status', 'Amount']],
    body: tableBody,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 130;

  // Total
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total Escrow Value: EGP ${contract.totalAmount.toLocaleString()}`, 14, finalY + 15);

  // Footer / Terms
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('This is an electronically generated B2B smart contract.', 14, 275);
  doc.text('All funds are secured via Mahalla Cluster Escrow until milestones are released.', 14, 280);

  doc.save(`Contract_${contract.id.slice(-6)}.pdf`);
};
