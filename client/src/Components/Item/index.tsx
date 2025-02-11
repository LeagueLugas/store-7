import { Link } from "@/Router";
import styled, { css } from "styled-components";
import ImageHoverWrapper from "../ImageHoverWrapper";
import { WishIcon } from "@/assets";
import { convertToKRW } from "@/utils/util";
import { postWishProduct, deleteWishProduct } from "@/api/my";
import { media } from "@/styles/theme";
import properties from "@/config/properties";
import { useState, useMemo } from "react";
import useDebounce from "@/hooks/useDebounce";
import useDidMountEffect from "@/hooks/useDidMountEffect";
import { useRecoilValue } from "recoil";
import { loginState } from "@/store/state";
import { QueryObserverResult } from "react-query";
import { useEffect } from "react";

type ItemType = {
  id: number;
  name: string;
  price: number;
  originPrice: number;
  discountRate: number;
  isWish: boolean;
  amount: number;
  image: string;
  createdAt: Date;
  wishCount: number;
  stock: number;
  refetch?: () => Promise<QueryObserverResult<unknown>>;
};

const Item = ({
  id,
  name,
  price,
  originPrice,
  discountRate,
  isWish,
  image,
  createdAt,
  refetch,
  wishCount,
  stock,
}: ItemType) => {
  const [isMyWish, setIsMyWish] = useState(isWish);
  const debounceIsMyWish = useDebounce<boolean>(isMyWish, 300);
  const isLoggedin = useRecoilValue(loginState);
  stock;
  const tags = useMemo(() => {
    const tags = [];
    if (discountRate) {
      tags.push("sale");
    }
    if (createdAt && new Date().getDate() - new Date(createdAt).getDate() < 5) {
      tags.push("new");
    }
    if (wishCount > 5) {
      tags.push("best");
    }
    return tags;
  }, [discountRate, createdAt, wishCount]);

  const pathname = location.pathname.split("/")[1];
  const handleClickWish = async (e: Event) => {
    e.stopPropagation();
    if (!isLoggedin) {
      return;
    }
    setIsMyWish((isMyWish) => !isMyWish);
  };

  useEffect(() => {
    setIsMyWish(isWish);
  }, [isWish]);

  useDidMountEffect(async () => {
    debounceIsMyWish ? await postWishProduct(id) : await deleteWishProduct(id);
    if (pathname === "mypage") {
      refetch();
    }
  }, [debounceIsMyWish]);

  return (
    <li data-testid="test__itme">
      <Link to={`/detail/${id}`}>
        <ItemWrapper>
          <div className="thumbnail">
            <ImageHoverWrapper src={properties.imgURL + image} />
            <div className="thumbnail__tags">
              {tags.map((tag, idx) => (
                <Tag tag={tag} key={idx}>
                  {tag.toUpperCase()}
                </Tag>
              ))}
            </div>
            <WishBox>
              <WishIcon
                className={isMyWish ? "is-wish" : "not-wish"}
                onClick={handleClickWish}
              />
            </WishBox>
            {stock === 0 && (
              <div className="thumbnail__sold-out">
                <span>품절</span>
              </div>
            )}
          </div>
          <div className="info">
            <div className="info__name">{name}</div>
            {discountRate !== 0 && (
              <div className="info__sale">
                <div className="discount-rate">{discountRate}%</div>
                <div className="before-price">{convertToKRW(originPrice)}</div>
              </div>
            )}
            <div className="info__price">{convertToKRW(price)}</div>
          </div>
        </ItemWrapper>
      </Link>
    </li>
  );
};

const ItemWrapper = styled.div`
  padding-bottom: 2rem;
  ${({ theme }) => theme.borderRadius.medium}
  &:hover {
    ${({ theme }) => theme.shadow}
    transition: all 0.2s;
  }

  .thumbnail {
    position: relative;
    ${({ theme }) => theme.borderRadius.medium}
    overflow: hidden;

    &__tags {
      position: absolute;
      top: 1rem;
      left: 1rem;
      display: flex;
    }

    &__sold-out {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      ${({ theme }) => theme.flexCenter}
      background: rgba(0,0,0,0.7);
      & > span {
        color: white;
        font-size: 6rem;
        font-weight: bold;
        font-family: "BMDOHYEON";
      }
    }
  }

  .info {
    margin-top: 1.5rem;
    padding: 0 1rem;
    &__name {
      ${({ theme }) => theme.font.medium};
      font-weight: 500;
      margin-bottom: 1rem;
      line-height: 2rem;
      height: 1.7rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      word-wrap: break-word;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    &__price {
      ${({ theme }) => theme.font.large};
      font-weight: 900;
    }

    &__sale {
      display: flex;
      align-items: center;
      margin-bottom: 0.3rem;
      .discount-rate {
        color: ${({ theme }) => theme.color.red};
        ${({ theme }) => theme.font.medium};
        font-weight: 700;
      }
      .before-price {
        ${({ theme }) => theme.font.small};
        margin-left: 0.5rem;
        text-decoration: line-through;
      }
    }
  }
  ${media.tablet} {
    .thumbnail {
      &__tags {
        flex-direction: column;
      }
      &__sold-out {
        & > span {
          font-size: 3.5rem;
        }
      }
    }
  }

  ${media.mobile} {
    position: relative;
    box-shadow: 0 0 0.4rem 0.2rem rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
    padding-bottom: 1rem;

    .info {
      display: flex;
      flex-direction: column;
      height: 7rem;
      justify-content: space-between;
      &__name {
        -webkit-line-clamp: 1;
      }
    }

    .thumbnail {
      &__tags {
        flex-direction: row;
      }
      &__sold-out {
        & > span {
          font-size: 5rem;
        }
      }
    }
  }
`;

const WishBox = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;

  & > svg {
    width: 3.6rem;
    height: 3.6rem;
    &:active {
      transform: scale(1.1);
    }
    &.is-wish {
      fill: ${({ theme }) => theme.color.primary1};
      opacity: 1;
    }
    &.not-wish {
      fill: #fff;
      opacity: 0.7;
      &:hover {
        opacity: 1;
        fill: none;
        stroke: ${({ theme }) => theme.color.primary3};
        stroke-width: 3rem;
      }
    }
  }

  ${media.mobile} {
    & > svg {
      width: 2.4rem;
      height: 2.4rem;
      fill: none;
      stroke: ${({ theme }) => theme.color.primary1};
      stroke-width: 3rem;
    }
  }
`;

const Tag = styled.div<{
  tag: string;
}>`
  ${({ theme, tag }) => css`
    ${theme.font.medium}
    ${theme.tags[tag]}
    ${theme.borderRadius.small}
  `};

  font-weight: bold;
  padding: 0.7rem 1rem 0.2rem 1rem;
  box-shadow: 2px 2px 5px #7d8181;
  & + & {
    margin-left: 1rem;
  }

  ${media.tablet} {
    ${({ theme }) => theme.font.small}
    padding: 0.4rem 1rem 0.1rem 1rem;
    & + & {
      margin-left: 0;
      margin-top: 1rem;
    }
  }
  ${media.mobile} {
    & + & {
      margin-left: 1rem;
      margin-top: 0;
    }
  }
`;

export default Item;
