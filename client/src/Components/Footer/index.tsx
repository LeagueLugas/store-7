import { gap, media } from "@/styles/theme";
import styled from "styled-components";
import { Logo } from "@/assets";

const Footer = () => {
  return (
    <Wrapper>
      <img width="300" src={Logo} />

      <div>
        <b>
          <span>공지사항</span>
          <span>1:1문의</span>
          <span>이용약관</span>
          <span>개인정보처리방침</span>
          <span>판매처 안내</span>
        </b>

        <p>
          {`상호 : (주)ET들 | 대표 : ET | 사업자등록번호 : 120-87-65763 | 통신판매업신고번호 : 2012-서울송파-0515 | [사업자정보확인]
          팩스번호 : 은하철도999 | 메일 : et_store@ets.com | ET네 만물상 인스타그램 : @et_store
          주소 : 안드로메다 은하단구 은하수로 2 장은빌딩
          © ETs Corp. All right Reserved`}
        </p>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 30rem;
  background-color: ${({ theme }) => theme.color.light_grey1};
  ${({ theme }) => theme.flexCenter};
  ${gap("10rem")}
  b {
    ${({ theme }) => theme.font.medium};
    display: flex;
    justify-content: space-between;
    font-weight: 700;
  }
  p {
    ${({ theme }) => theme.font.small};
    margin-top: 3rem;
    line-height: 2rem;
    white-space: pre-line;
    color: ${({ theme }) => theme.color.grey1};
  }
  ${media.tablet} {
    img {
      width: 20rem;
      height: auto;
    }
  }
  ${media.mobile} {
    img {
      width: 10rem;
      height: auto;
    }
  }
`;

export default Footer;
