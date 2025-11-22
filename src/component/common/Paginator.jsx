
import { Container, Pagination } from "react-bootstrap";

const Paginator = ({
  pageSize,
  totalItems,
  totalPages,
  currPage,
  setCurrPage,
  darkBackground,
}) => {
  let active = currPage;
  let items = [];
  for (let i = 1; i <= Math.ceil(totalItems / pageSize); i++) {
    items.push(
      <Pagination.Item
        key={i}
        active={i == parseInt(active)}
        onClick={() => setCurrPage(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("ellipsis-left");
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis-right");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const indexOfLastItem = currPage * pageSize; // idxLastPlus1
  const indexOfFirstItem = indexOfLastItem - pageSize; // indexOfFirst

  // Change page
  const paginate = (pageNumber) => setCurrPage(pageNumber);

  return (
    <Container className="my-1">
      <div className="d-flex justify-content-center mt-1">
        <Pagination>
          <Pagination.Prev
            onClick={() => paginate(Math.max(1, currPage - 1))}
            disabled={currPage === 1}
          />

          {getPageNumbers().map((pageNumber, index) => {
            if (
              pageNumber === "ellipsis-left" ||
              pageNumber === "ellipsis-right"
            ) {
              return <Pagination.Ellipsis key={index} />;
            }

            return (
              <Pagination.Item
                key={index}
                active={pageNumber === currPage}
                onClick={() => paginate(pageNumber)}
              >
                {pageNumber}
              </Pagination.Item>
            );
          })}

          <Pagination.Next
            onClick={() => paginate(Math.min(totalPages, currPage + 1))}
            disabled={currPage === totalPages}
          />
        </Pagination>
      </div>

      <div className="text-center">
        <span className={darkBackground === undefined ? 'text-muted' : ""}>
          총 {totalPages} 페이지 중 {currPage} 번째 페이지 
        </span>
      </div>
    </Container>
  );
};

export default Paginator;
