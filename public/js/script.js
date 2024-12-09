// Function to render pagination
function renderPagination(pagination, currentPage) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = ''; // Clear previous pagination

    // If no pages are available
    if (!pagination.totalPages) {
        paginationContainer.innerHTML = '<p>No pages available</p>';
        return;
    }

    let paginationHtml = `<nav aria-label="Page navigation"><ul class="pagination justify-content-center">`;

    // Add the "Previous" button
    if (currentPage > 1) {
        paginationHtml += `<li class="page-item">
            <a class="page-link" href="#" onclick="fetchListings(${currentPage - 1})">Previous</a>
        </li>`;
    }

    // Page Numbers: Only display a subset of pages, e.g., 6 pages at a time
    const pagesToDisplay = 6;
    let startPage = Math.max(1, currentPage - Math.floor(pagesToDisplay / 2)); // Adjust start page to center around the current page

    let pages = [];
    for (let i = startPage; i < startPage + pagesToDisplay; i++) {
        if (i <= pagination.totalPages) {
            pages.push(i);
        }
    }

    // Add the page numbers to pagination HTML
    pages.forEach(page => {
        paginationHtml += `<li class="page-item ${page === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="fetchListings(${page})">${page}</a>
        </li>`;
    });

    // Add the "Next" button
    if (currentPage < pagination.totalPages) {
        paginationHtml += `<li class="page-item">
            <a class="page-link" href="#" onclick="fetchListings(${currentPage + 1})">Next</a>
        </li>`;
    }

    paginationHtml += `</ul></nav>`;

    // Add pagination HTML to the container
    paginationContainer.innerHTML = paginationHtml;
}
// Wait until the DOM is fully loaded before executing
document.addEventListener('DOMContentLoaded', function () {
    // Get the dropdown element
    const dropdown = document.getElementById('minimum_nights');
  
    // Add change event listener to the dropdown
    dropdown.addEventListener('change', function () {
      const minNights = this.value; // Get the selected value from the dropdown
  
      // Get current URL and convert it into URLSearchParams
      const urlParams = new URLSearchParams(window.location.search);
  
      // Ensure page is 1 and perPage is 5
      urlParams.set('page', 1); // Start from page 1
      urlParams.set('perPage', 5); // Set perPage to 5
      
      if (minNights) {
        urlParams.set('minimum_nights', minNights); // Add the minimum_nights to the query
      } else {
        urlParams.delete('minimum_nights'); // Remove minimum_nights if no selection
      }
  
      // Update the page URL with the new query parameters
      window.location.search = urlParams.toString();
    });
  });
  