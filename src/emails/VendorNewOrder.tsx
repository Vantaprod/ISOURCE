import * as React from "react";
import { Text, Section, Heading, Button } from "@react-email/components";
import { EmailLayout } from "./Layout";

export function VendorNewOrder({ vendorName, orderNumber, vendorNetKobo }: { vendorName: string; orderNumber: string; vendorNetKobo: number }) {
  return (
    <EmailLayout preview="You have a new order on Isource!">
      <Heading style={{ fontSize: "20px", fontWeight: "bold", color: "#18181b", marginBottom: "16px" }}>New Order Received! 📦</Heading>
      <Text style={{ fontSize: "16px", color: "#3f3f46", lineHeight: "1.5" }}>
        Hi {vendorName},<br /><br />You have a new order waiting to be packed. Please log in to dispatch it.
      </Text>
      <Section style={{ backgroundColor: "#f4f4f5", padding: "16px", borderRadius: "8px", margin: "24px 0" }}>
        <Text style={{ margin: "0", fontSize: "14px", color: "#71717a" }}>Order Number</Text>
        <Text style={{ margin: "4px 0 16px 0", fontSize: "16px", fontWeight: "bold", color: "#18181b" }}>{orderNumber}</Text>
        <Text style={{ margin: "0", fontSize: "14px", color: "#71717a" }}>Your Payout</Text>
        <Text style={{ margin: "4px 0 0 0", fontSize: "16px", fontWeight: "bold", color: "#16a34a" }}>₦{(vendorNetKobo / 100).toLocaleString()}</Text>
      </Section>
      <Button href="https://www.isourcemarket.com/vendor/orders" style={{ backgroundColor: "#18181b", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", fontWeight: "bold", textDecoration: "none", textAlign: "center", display: "block" }}>Go to Dashboard</Button>
    </EmailLayout>
  );
}