import { setServers } from "node:dns";
setServers(["8.8.8.8"]);
import { getShippingQuote } from "../src/app/actions/shipping";

(async () => {
  console.log("Testing Shipping Quotes (Lagos)...\n");

  // Test 1: Light item (Home Delivery)
  const lightItem = [{ productId: "1", quantity: 1, weightGrams: 500, lengthCm: 10, widthCm: 10, heightCm: 10 }];
  const q1 = await getShippingQuote({ items: lightItem, customerState: "Lagos", isPickup: false });
  console.log("Test 1: 500g Home Delivery ->", q1);

  // Test 2: Light item (Pickup)
  const q2 = await getShippingQuote({ items: lightItem, customerState: "Lagos", isPickup: true });
  console.log("\nTest 2: 500g Pickup ->", q2);

  // Test 3: Heavy item (e.g. Solar Battery, 10kg Actual, 40x30x30 Volumetric = 7.2kg Vol)
  const heavyItem = [{ productId: "2", quantity: 1, weightGrams: 10000, lengthCm: 40, widthCm: 30, heightCm: 30 }];
  const q3 = await getShippingQuote({ items: heavyItem, customerState: "Lagos", isPickup: false });
  console.log("\nTest 3: 10kg Solar Battery Home Delivery ->", q3);

  // Test 4: Out of zone (Abuja)
  const q4 = await getShippingQuote({ items: lightItem, customerState: "Abuja", isPickup: false });
  console.log("\nTest 4: Abuja (Out of Zone) ->", q4);

  process.exit(0);
})();