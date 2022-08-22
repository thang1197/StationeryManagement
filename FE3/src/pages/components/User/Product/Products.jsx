import React, { useEffect, useState} from "react";
import Skeleton from "react-loading-skeleton";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import "./products.scss"
import { Container } from "@mui/system";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addCart } from "../../../../redux/cart/cart.action";
import baseURL from "../../../../baseurl";

const Products = (props) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const sta = useSelector((state) => state.products.status);
  const user = useSelector((state) => state.user.currentUser);
  useEffect(()=>{
      if(sta === "loading"){
        setLoading(true);
      }
      if(sta === "done"){
        setLoading(false);
      }
  })
  const addProduct = (product) => {
        dispatch(addCart(product));
  }
  const proList = products.filter(e=>e.categoryId === props.cate);
  const Loading = () => {
    return (
      <>
        <div className="col-md-3">
          <Skeleton height={350} />
        </div>

        <div className="col-md-3">
          <Skeleton height={350} />
        </div>

        <div className="col-md-3">
          <Skeleton height={350} />
        </div>

        <div className="col-md-3">
          <Skeleton height={350} />
        </div>
      </>
    );
  };

  const ShowProducts = () => {
    return (
      <>
        <Container>
          <Row xs={1} md={2}>
            {props.cate !== 0?
              proList.map((pro) => {
                return (
                pro.roleId === user.userRoles && pro.productEnable === true ?               
                    <Col md={3} sm={6} key={pro.productId}>
                      <div className="product-grid3">
                        <div className="product-image3">
                          <div>
                            <img className="pic-1" src={ baseURL+pro.featureImgPath} alt={pro.title} />
                            <img className="pic-2" src={ baseURL+pro.featureImgPath} alt={pro.title} />
                          </div>
                          <ul className="social">
                            <li><button className="btn-detail"  onClick={()=>addProduct(pro)}><ShoppingCartIcon /></button></li>
                          </ul>
                          <span className="product-new-label">New</span>
                        </div>
                        <div className="product-content">
                          <h3 className="title"><div>{pro.productName}</div></h3>
                          <div className="price">
                            $63.50
                            <span>{pro.price}</span>
                          </div>
                          <ul className="rating">
                            <li><StarIcon /></li>
                            <li><StarIcon /></li>
                            <li><StarIcon /></li>
                            <li className="disable"><StarOutlineIcon /></li>
                            <li className="disable"><StarOutlineIcon /></li>
                          </ul>
                        </div>
                      </div>
                    </Col>    
                :
                null
                );
              })
              :
              products.map((product) => {
                return (
                  product.roleId === user.userRoles && product.productEnable === true ?
                    <Col md={3} sm={6} key={product.productId}>
                      <div className="product-grid3">
                        <div className="product-image3">
                          <div>
                            <img className="pic-1" src={ baseURL+product.featureImgPath} alt={product.title} />
                            <img className="pic-2" src={ baseURL+product.featureImgPath} alt={product.title} />
                          </div>
                          <ul className="social">
                            <li><button className="btn-detail"  onClick={()=>addProduct(product)}><ShoppingCartIcon /></button></li>
                          </ul>
                          <span className="product-new-label">New</span>
                        </div>
                        <div className="product-content">
                          <h3 className="title"><div>{product.productName}</div></h3>
                          <div className="price">
                            ${product.price}
                          </div>
                          <ul className="rating">
                            <li><StarIcon /></li>
                            <li><StarIcon /></li>
                            <li><StarIcon /></li>
                            <li className="disable"><StarOutlineIcon /></li>
                            <li className="disable"><StarOutlineIcon /></li>
                          </ul>
                        </div>
                      </div>
                    </Col>
                  :
                  null
                );
              })
            }    
          </Row>
        </Container>
      </>
    );
  };
  return (
    <div>
      <div className="container my-5">
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </div>
  );
};
export default Products;





