import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import Context from "../context";
import displayINRCurrency from "../helpers/displayCurrency";
import { MdDelete } from "react-icons/md";
import getImageUrl from "../helpers/getImageUrl";
import { FiMinus, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const context = useContext(Context);
  const loadingCart = new Array(4).fill(null);
  const totalQty = data.reduce(
    (previousValue, currentValue) =>
      previousValue + (currentValue?.quantity || 0),
    0,
  );
  const totalPrice = data.reduce(
    (preve, curr) =>
      preve + (curr?.quantity || 0) * (curr?.productId?.sellingPrice || 0),
    0,
  );
  const shippingCost = totalPrice > 1500 ? 0 : 75;
  const taxAmount = Math.round(totalPrice * 0.075);
  const grandTotal = totalPrice + shippingCost + taxAmount;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.addToCartProductView.url, {
        method: SummaryApi.addToCartProductView.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });

      const responseData = await response.json();

      if (responseData.success) {
        const validCartItems = (responseData.data || []).filter(
          (item) => item?.productId,
        );
        setData(validCartItems);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoading = async () => {
    await fetchData();
  };

  useEffect(() => {
    handleLoading();
  }, []);

  const increaseQty = async (id, qty) => {
    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
        quantity: qty + 1,
      }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      fetchData();
    }
  };

  const decraseQty = async (id, qty) => {
    if (qty >= 2) {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
          quantity: qty - 1,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        fetchData();
      }
    }
  };

  const deleteCartProduct = async (id) => {
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        _id: id,
      }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      fetchData();
      context.fetchUserAddToCart();
    }
  };

  const handleProceedToPayment = async () => {
    if (!data.length || checkoutLoading) {
      return;
    }

    setCheckoutLoading(true);

    try {
      const response = await fetch(SummaryApi.createCheckoutSession.url, {
        method: SummaryApi.createCheckoutSession.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });

      const responseData = await response.json();

      if (responseData.success && responseData.url) {
        window.location.href = responseData.url;
        return;
      }

      toast.error(responseData.message || "Unable to start Stripe checkout");
    } catch (error) {
      toast.error(error.message || "Unable to start Stripe checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="cart-page">
      <section className="cart-hero">
        <p className="cart-hero__eyebrow">Checkout Console</p>
        <h1 className="cart-hero__title">Your Cart</h1>
        <p className="cart-hero__subtitle">
          Ignition phase: finalizing your hardware acquisition.
        </p>
      </section>

      {data.length === 0 && !loading ? (
        <div className="cart-empty">
          <p className="cart-empty__title">Cart is empty</p>
          <p className="cart-empty__text">
            Add a few products to bring the checkout panel to life.
          </p>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {loading
              ? loadingCart?.map((el, index) => (
                  <div
                    key={el + "Add To Cart Loading" + index}
                    className="cart-card cart-card--loading animate-pulse"
                  />
                ))
              : data.map((product, index) => {
                  if (!product?.productId) {
                    return null;
                  }

                  const imageUrl = getImageUrl(
                    product?.productId?.productImage,
                  );
                  const itemTotal =
                    (product?.productId?.sellingPrice || 0) *
                    (product?.quantity || 0);

                  return (
                    <article
                      key={product?._id + "Add To Cart Loading"}
                      className="cart-card"
                    >
                      <div className="cart-card__media">
                        {imageUrl ? (
                          <img src={imageUrl} className="cart-card__image" />
                        ) : (
                          <div className="image-placeholder-text image-placeholder-text--dark image-placeholder-text--small">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="cart-card__content">
                        <div className="cart-card__header">
                          <div className="cart-card__copy">
                            <span className="cart-card__category">
                              {product?.productId?.category || "Featured"}
                            </span>
                            <h2 className="cart-card__title">
                              {product?.productId?.productName}
                            </h2>
                            <p className="cart-card__meta">
                              {product?.productId?.brandName || "TechPulse"} /
                              Qty {product?.quantity}
                            </p>
                          </div>

                          <div className="cart-card__price-block">
                            <p className="cart-card__price">
                              {displayINRCurrency(
                                product?.productId?.sellingPrice,
                              )}
                            </p>
                            <p className="cart-card__line-total">
                              line total {displayINRCurrency(itemTotal)}
                            </p>
                          </div>
                        </div>

                        <div className="cart-card__footer">
                          <div className="cart-qty">
                            <button
                              className="cart-qty__button"
                              onClick={() =>
                                decraseQty(product?._id, product?.quantity)
                              }
                            >
                              <FiMinus />
                            </button>
                            <span className="cart-qty__value">
                              {String(product?.quantity).padStart(2, "0")}
                            </span>
                            <button
                              className="cart-qty__button"
                              onClick={() =>
                                increaseQty(product?._id, product?.quantity)
                              }
                            >
                              <FiPlus />
                            </button>
                          </div>

                          <button
                            className="cart-remove"
                            onClick={() => deleteCartProduct(product?._id)}
                          >
                            <MdDelete className="text-lg" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
          </div>

          <aside className="cart-summary-wrap">
            <div className="cart-summary">
              <h2 className="cart-summary__title">Order Summary</h2>

              <div className="cart-summary__rows">
                <div className="cart-summary__row">
                  <p className="cart-summary__label">Quantity</p>
                  <p className="cart-summary__value">{totalQty}</p>
                </div>
                <div className="cart-summary__row">
                  <p className="cart-summary__label">Subtotal</p>
                  <p className="cart-summary__value">
                    {displayINRCurrency(totalPrice)}
                  </p>
                </div>
                <div className="cart-summary__row">
                  <p className="cart-summary__label">Shipping</p>
                  <p className="cart-summary__value">
                    {shippingCost === 0
                      ? "FREE"
                      : displayINRCurrency(shippingCost)}
                  </p>
                </div>
                <div className="cart-summary__row">
                  <p className="cart-summary__label">Tax</p>
                  <p className="cart-summary__value">
                    {displayINRCurrency(taxAmount)}
                  </p>
                </div>
                <div className="cart-summary__divider" />
                <div className="cart-summary__row cart-summary__row--total">
                  <p className="cart-summary__total-label">Total</p>
                  <div>
                    <p className="cart-summary__total-value">
                      {displayINRCurrency(grandTotal)}
                    </p>
                    <p className="cart-summary__hint">Secure checkout ready</p>
                  </div>
                </div>
              </div>

              <button
                className="cart-summary__button"
                onClick={handleProceedToPayment}
                disabled={!data.length || checkoutLoading}
              >
                {checkoutLoading
                  ? "Redirecting to Stripe..."
                  : "Proceed To Payment"}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
