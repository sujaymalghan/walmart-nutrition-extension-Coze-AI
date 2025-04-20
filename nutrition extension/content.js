// content.js
// Strategy 1: Use window load event (your original approach)
window.addEventListener("load", attemptToProcessCart);

// Strategy 2: Add a mutation observer to detect when elements are added
function setupMutationObserver() {
  console.log("Setting up mutation observer for cart items...");
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        // Check if our target elements exist now
        const productEls = document.querySelectorAll('li div[data-testid="productName"] span.w_V_DM');
        if (productEls.length > 0) {
          console.log(`Found ${productEls.length} products after DOM mutation`);
          observer.disconnect(); // Stop observing once we found our elements
          processCartItems();
          return;
        }
      }
    }
  });
  
  // Start observing the document body for changes
  observer.observe(document.body, { childList: true, subtree: true });
}

// Strategy 3: Check periodically with setInterval
function setupIntervalCheck() {
  console.log("Setting up interval check for cart items...");
  const checkInterval = setInterval(() => {
    const productEls = document.querySelectorAll('li div[data-testid="productName"] span.w_V_DM');
    if (productEls.length > 0) {
      console.log(`Found ${productEls.length} products using interval check`);
      clearInterval(checkInterval);
      processCartItems();
    }
  }, 500); // Check every 500ms
  
  // Clear interval after 10 seconds to avoid infinite checking
  setTimeout(() => {
    clearInterval(checkInterval);
    console.log("Stopped interval checking after timeout");
  }, 10000);
}

// Main function to attempt processing cart
function attemptToProcessCart() {
  // Only on the cart page
  if (!window.location.pathname.includes("/cart")) {
    console.log("Not on cart page, exiting");
    return;
  }
  
  console.log("Cart page detected, checking for items...");
  
  // Try immediately
  const productEls = document.querySelectorAll('li div[data-testid="productName"] span.w_V_DM');
  if (productEls.length > 0) {
    console.log(`Found ${productEls.length} products immediately`);
    processCartItems();
    return;
  }
  
  console.log("No products found immediately, setting up alternative detection methods");
  
  // Setup backup strategies
  setupMutationObserver();
  setupIntervalCheck();
}

// Process the cart items once they're found
function processCartItems() {
  const productEls = Array.from(
    document.querySelectorAll('li div[data-testid="productName"] span.w_V_DM')
  );
  
  if (productEls.length === 0) {
    console.log("⚠️ No cart items found.");
    return;
  }
  
  console.log(`🔍 Processing ${productEls.length} cart items for nutrition data...`);
  
  productEls.forEach((el, idx) => {
    console.log(`Processing item ${idx + 1}:`, el.textContent);
    const itemName = el.textContent;
    
    chrome.runtime.sendMessage(
      { type: "FETCH_NUTRITION", itemName, elementIndex: idx },
      response => {
        if (response) {
          console.log(`✅ Nutrition for "${itemName}":\n${response}`);
        } else if (response && response.error) {
          console.warn(`❌ Nutrition failed for "${itemName}":`, response.error);
        } else {
          console.warn(`❌ No nutrition data for "${itemName}".`);
        }
      }
    );
  });
}

attemptToProcessCart();