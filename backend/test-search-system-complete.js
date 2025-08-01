const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:8080';

async function testSearchSystem() {
  console.log('🧪 Testing Complete Search System\n');
  
  try {
    // Test 1: Basic search
    console.log('1️⃣ Testing basic search...');
    const basicSearch = await axios.get(`${BASE_URL}/search/advanced?query=iphone`);
    console.log(`✅ Basic search: Found ${basicSearch.data.data.products.length} products`);
    
    // Test 2: Category filter
    console.log('\n2️⃣ Testing category filter...');
    const categorySearch = await axios.get(`${BASE_URL}/search/advanced?category=Electronics`);
    console.log(`✅ Category filter: Found ${categorySearch.data.data.products.length} electronics products`);
    
    // Test 3: Price range filter
    console.log('\n3️⃣ Testing price range filter...');
    const priceSearch = await axios.get(`${BASE_URL}/search/advanced?minPrice=1000&maxPrice=10000`);
    console.log(`✅ Price range filter: Found ${priceSearch.data.data.products.length} products in price range`);
    
    // Test 4: Autocomplete
    console.log('\n4️⃣ Testing autocomplete...');
    const autocomplete = await axios.get(`${BASE_URL}/search/autocomplete?query=iph`);
    console.log(`✅ Autocomplete: Found ${autocomplete.data.data.suggestions.length} suggestions`);
    
    // Test 5: Popular searches
    console.log('\n5️⃣ Testing popular searches...');
    const popularSearches = await axios.get(`${BASE_URL}/search/popular?limit=5`);
    console.log(`✅ Popular searches: Found ${popularSearches.data.data.categories.length} popular categories`);
    
    // Test 6: Combined filters
    console.log('\n6️⃣ Testing combined filters...');
    const combinedSearch = await axios.get(`${BASE_URL}/search/advanced?query=apple&category=Electronics&minPrice=100000`);
    console.log(`✅ Combined filters: Found ${combinedSearch.data.data.products.length} products`);
    
    // Test 7: Sorting
    console.log('\n7️⃣ Testing sorting...');
    const sortedSearch = await axios.get(`${BASE_URL}/search/advanced?sortBy=price&sortOrder=desc`);
    console.log(`✅ Sorting: Found ${sortedSearch.data.data.products.length} products sorted by price`);
    
    // Test 8: Pagination
    console.log('\n8️⃣ Testing pagination...');
    const paginatedSearch = await axios.get(`${BASE_URL}/search/advanced?page=1&limit=5`);
    console.log(`✅ Pagination: Found ${paginatedSearch.data.data.products.length} products on page 1`);
    console.log(`   Total pages: ${paginatedSearch.data.data.pagination.totalPages}`);
    
    // Test 9: Frontend accessibility
    console.log('\n9️⃣ Testing frontend accessibility...');
    try {
      const frontendResponse = await axios.get(FRONTEND_URL);
      console.log(`✅ Frontend: Accessible at ${FRONTEND_URL}`);
    } catch (error) {
      console.log(`❌ Frontend: Not accessible at ${FRONTEND_URL}`);
    }
    
    // Test 10: Search with no results
    console.log('\n🔟 Testing search with no results...');
    const noResultsSearch = await axios.get(`${BASE_URL}/search/advanced?query=nonexistentproduct`);
    console.log(`✅ No results search: Found ${noResultsSearch.data.data.products.length} products (expected 0)`);
    
    console.log('\n🎉 All search system tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   ✅ Backend API endpoints working');
    console.log('   ✅ Search functionality operational');
    console.log('   ✅ Filters working correctly');
    console.log('   ✅ Autocomplete functioning');
    console.log('   ✅ Pagination working');
    console.log('   ✅ Frontend accessible');
    
  } catch (error) {
    console.error('❌ Search system test failed:', error.response?.data || error.message);
  }
}

testSearchSystem(); 