import styled from "styled-components";
import Checkbox from "@/Components/Checkbox";
import { convertToKRW } from "@/utils/util";
import { gap } from "@/styles/theme";
import { Close } from "@/assets";
import { deleteCart, patchCart } from "@/api/carts";
import { useRecoilValue } from "recoil";
import { loginState } from "@/store/state";
import { CartType } from "@/shared/type";
import { useState } from "react";
import { Triangle } from "@/assets";
import useInput from "@/hooks/useInput";
import Input from "../Input";
import useDebounce from "@/hooks/useDebounce";
import { useEffect } from "react";

export type ItemInfoBoxProps = {
  id: number;
  name: string;
  amount: number;
  price: number;
  deliveryCost: number;
  images?: string[];
  isChecked?: boolean;
  handleCheck?: Function;
  checkboxVisible?: boolean;
  refetch?: Function;
};

export const output = ({ price, deliveryCost }) => {
  return {
    priceOutput: `총 ${convertToKRW(price)}`,
    deliveryOutput: `배송비 ${convertToKRW(deliveryCost)}`,
  };
};

const ItemInfoBox = ({
  id,
  name,
  amount,
  price,
  deliveryCost,
  images,
  isChecked,
  handleCheck,
  checkboxVisible = false,
  refetch,
}: ItemInfoBoxProps) => {
  const OUTPUT = output({ ...{ amount, price, deliveryCost } });

  const isLogined = useRecoilValue(loginState);

  const handleDeleteCart = async (id: number) => {
    try {
      if (isLogined) deleteCart(id);
      else {
        const exist: CartType = JSON.parse(localStorage.getItem("carts"));
        const itemIdxToDelete = exist.items.findIndex((i) => i.id === id);

        exist.items.splice(itemIdxToDelete, 1);

        localStorage.setItem("carts", JSON.stringify(exist));
      }
    } catch (error) {
      console.log(error);
    }
    location.reload();
  };

  const numValue = useInput(amount.toString());
  const debouncedNumValue = useDebounce(numValue.value);

  const handleClickNumVal = async (val: 1 | -1) => {
    let num = parseInt(numValue.value);
    if (val === 1) {
      numValue.setValue((num + 1).toString());
    } else {
      if (num > 1) numValue.setValue((num - 1).toString());
    }
    refetch();
  };

  const handlePatchCart = async () => {
    await patchCart(id, { amount: parseInt(debouncedNumValue) });
    refetch();
  };
  useEffect(() => {
    handlePatchCart();
  }, [debouncedNumValue]);

  return (
    <Wrapper>
      <div className="info">
        {checkboxVisible && <Checkbox {...{ isChecked, handleCheck }} />}
        <img role="img" src={process.env.IMG_URL + images[0]} />
        <div>
          <div className="info__name">{name}</div>
          <div className="info__num">
            <div>수량</div>
            <div className="num-input">
              <NumInput value={numValue.value} onChange={numValue.onChange} />
              <div>
                <button type="button" onClick={() => handleClickNumVal(1)}>
                  <Triangle className="num-input__up" />
                </button>
                <button type="button" onClick={() => handleClickNumVal(-1)}>
                  <Triangle className="num-input__down" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="price">
        <div>{OUTPUT.priceOutput}</div>
        <div>{OUTPUT.deliveryOutput}</div>
      </div>

      {checkboxVisible && (
        <Close onClick={() => handleDeleteCart(id)} className="close-btn" />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  ${({ theme }) => theme.font.medium};
  width: 100%;
  background-color: ${({ theme }) => theme.color.background};
  width: 100%;
  border-radius: 1rem;
  padding: 2rem;
  box-sizing: border-box;
  position: relative;
  .info {
    display: flex;
    align-items: flex-start;
    ${gap("2rem")}
    &__name {
      ${({ theme }) => theme.font.large};
    }
    &__num {
      margin-top: 1rem;
      ${({ theme }) => theme.flexCenter};
      ${gap("1rem")}
    }
  }
  img {
    width: 7rem;
    height: 7rem;
    background-color: ${({ theme }) => theme.color.grey1};
    object-fit: cover;
    border-radius: 0.5rem;
  }
  .price {
    ${({ theme }) => theme.flexCenter};
    font-weight: 700;
    justify-content: flex-end;
    ${gap("2rem")}
  }
  .close-btn {
    cursor: pointer;
    position: absolute;
    top: 1rem;
    right: 1rem;
    fill: ${({ theme }) => theme.color.primary1};
  }

  .num-input {
    ${({ theme }) => theme.flexCenter}
    margin-right: 2rem;
    background: #fff;
    div {
      ${({ theme }) => theme.flexCenter}
      flex-direction: column;
      height: 2.5rem;
      button {
        ${({ theme }) => theme.flexCenter};
        cursor: pointer;
        width: 1.6rem;
        /* height: 1.6rem; */
        border: none;
        padding: 0.4rem;
        background: ${({ theme }) => theme.color.primary2};
      }
    }
    &__up {
      transform: rotate(-90deg);
      fill: white;
      height: 1.1rem;
    }
    &__down {
      transform: rotate(90deg);
      fill: white;
      height: 1.2rem;
    }
  }
`;

const NumInput = styled(Input)`
  width: 3rem;
  text-align: center;
  padding: 1rem;
`;

export default ItemInfoBox;
