import * as React from "react";
import { Text, Section, Heading, Button } from "@react-email/components";
import { EmailLayout } from "./Layout";

export function OrderConfirmation({ customerName, orderId, totalKobo }: { customerName: string; orderId: string; totalKobo: number }) {
  return (
    <EmailLayout preview="Your Isource order is confirmed!">
      <Heading style={{ fontSize: "20px", fontWeight: "bold", color: "#18181b", marginBottom: "16px" }}>Order Confirmed! 🎉</Heading>
      <Text style={{ fontSize: "16px", color: "#3f3f46", lineHeight: "1.5" }}>
        Hi {customerName},<br /><br />Thank you for shopping on Isource. We've received your payment and your order is now being processed.
      </Text>
      <Section style={{ backgroundColor: "#f4f4f5", padding: "16px", borderRadius: "8px", margin: "24px 0" }}>
        <Text style={{ margin: "0", fontSize: "14px", color: "#71717a" }}>Order Number</Text>
        <Text style={{ margin: "4px 0 16px 0", fontSize: "16px", fontWeight: "bold", color: "#18181b" }}>{orderId}</Text>
        <Text style={{ margin: "0", fontSize: "14px", color: "#71717a" }}>Total Amount Paid</Text>
        <Text style={{ margin: "4px 0 0 0", fontSize: "16px", fontWeight: "bold", color: "#F07824" }}>₦{(totalKobo / 100).toLocaleString()}</Text>
      </Section>
      <Button href="https://www.isourcemarket.com/account/orders" style={{ backgroundColor: "#F07824", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", fontWeight: "bold", textDecoration: "none", textAlign: "center", display: "block" }}>View Order</Button>
    </EmailLayout>
  );
}