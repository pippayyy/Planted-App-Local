import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import {
  Container,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  Col,
  FormGroup,
  Label,
} from "reactstrap";
import { Search } from "react-bootstrap-icons";
import ResultsProduct from "./ResultsProducts";
import useFetchProduct from "./useFetchProduct";
import fetchCategoryActive from "./fetchCategoryActive";
import ResultsList from "./ResultsList";
import SelectedCategoryContext from "./SelectedCategoryContext";
import CardIconText from "./CardIconText";
import fetchFavs from "./fetchFavs";
import fetchSession from "./fetchSession";
import ReactPaginate from "react-paginate";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useContext(
    SelectedCategoryContext
  );

  const location = useLocation();
  //Get filter Id (which category/section) - if none set e.g. clicked on 'Shop' in navbar, then use default of 1
  const { filterId } = location.state ?? { filterId: { id: 1 } };

  useEffect(() => {
    setSelectedCategory(filterId.id);
  }, [filterId.id]);

  //Used to get category data and populate category sections
  const resultsCategories = useQuery(["getCategories"], fetchCategoryActive);
  const categories = resultsCategories?.data?.categories ?? [];

  const [searchParamSection, setSearchParamSection] = useState("");
  const [searchParam, setSearchParam] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [productsSorted, setProductsSorted] = useState([]);

  //Get products json based on category selected
  const [products, status] = useFetchProduct(
    "category/" + selectedCategory + searchParamSection
  );

  //Used to sort products
  useEffect(() => {
    console.log("in product useefect");
    setProductsSorted(products);
  }, [products]);

  //Used to sort products
  useEffect(() => {
    switch (sortValue) {
      case "dateDesc":
        //Sort by created date
        setProductsSorted(
          productsSorted.sort(
            (a, b) => parseFloat(b.product_id) - parseFloat(a.product_id)
          )
        );
        break;
      case "priceAsc":
        //Sort by price ascending
        setProductsSorted(
          productsSorted.sort(
            (a, b) => parseFloat(a.price) - parseFloat(b.price)
          )
        );
        break;
      case "priceDesc":
        //Sort by price descending
        setProductsSorted(
          productsSorted.sort(
            (a, b) => parseFloat(b.price) - parseFloat(a.price)
          )
        );
        break;
      default:
      // code block
    }
  }, [sortValue, productsSorted]);

  //Check if session exists
  const sessionResults = useQuery(["getSessionDetail"], fetchSession, 0, {
    retry: false,
  });
  //Get status of session
  const sessionExist = sessionResults?.data?.outcome?.message ?? [];
  const sessionRefetch = sessionResults?.refetch;

  //Refetch session on page load to ensure correct session status is set
  useEffect(() => {
    sessionRefetch();
  }, [sessionRefetch]);

  //Get items in customer favourites
  const favsResults = useQuery(["getFavs"], fetchFavs);
  //Get fav data
  const favs = favsResults?.data?.outcome ?? [];
  //Get refetch funciton to reload favs
  const favsRefetch = favsResults?.refetch;

  //pagination stuff
  const [currentPage, setCurrentPage] = useState(0);
  const [offset, setOffset] = useState(0);

  const PER_PAGE = 5;
  const currentPageData = productsSorted.slice(offset, offset + PER_PAGE);
  const pageCount = Math.ceil(productsSorted.length / PER_PAGE);

  function handlePageClick({ selected: selectedPage }) {
    console.log("currentPage prior setting: ", currentPage);
    setCurrentPage(selectedPage);
    console.log("currentPage: ", selectedPage);
    setOffset(selectedPage * PER_PAGE);
  }

  return (
    <Container fluid className="content-container">
      <Row>
        <Col xs="0" md="2" className=""></Col>
        <Col xs="12" md="8" className="">
          <div className="mt-3 mb-1">
            <InputGroup>
              <Input
                bsSize="lg"
                type="search"
                placeholder="Search"
                className="search-input-style"
                onChange={(e) => {
                  setSearchParam(e.target.value);
                  e.target.value == "" ? setSearchParamSection("") : null;
                  e.target.value == "" ? setSelectedCategory("all") : null;
                }}
              />
              <InputGroupText
                className="search-icon-style"
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchParamSection("/search/" + searchParam);
                  setCurrentPage(0);
                  setOffset(0 * PER_PAGE);
                }}
              >
                <Search className="fs-3 mx-2" />
              </InputGroupText>
            </InputGroup>
          </div>
          <ResultsList items={categories} />
          <FormGroup floating className="rounded-3 mt-2">
            <Input
              id="exampleSelect"
              name="select"
              type="select"
              onChange={(event) => {
                setSortValue(event.target.value);
              }}
            >
              <option value="dateAsc">Recommended</option>
              <option value="dateDesc">Whats New</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </Input>
            <Label for="exampleSelect">SORT</Label>
          </FormGroup>
          <ReactPaginate
            previousLabel={"←"}
            nextLabel={"→"}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          />
          <ResultsProduct
            products={currentPageData}
            favs={favs}
            refetch={favsRefetch}
            prodstatus={status}
            sessionExist={sessionExist}
          />
          <Row className="mt-4">
            <Col xs="0" lg="3" className=""></Col>
            <Col xs="12" lg="6" className="px-0">
              <CardIconText
                title="GET 10% OFF USING CODE ‘NEW’"
                descrip="Valid only for new customers"
                iconName="tagIcon"
                iconClass="fs-1"
                cardClass="my-2 border-0 bg-transparent"
                colOne="2"
                colTwo="10"
              />
            </Col>
            <Col xs="0" lg="3" className=""></Col>
          </Row>
        </Col>
        <Col xs="0" md="2" className=""></Col>
      </Row>
    </Container>
  );
};

export default Shop;
