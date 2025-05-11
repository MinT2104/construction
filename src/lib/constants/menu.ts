import { MenuItemType } from "../types/common/menu.interface";

const menuItems: MenuItemType[] = [
  {
    label: "Giới thiệu",
    isUseSidebar: true,
    type: "single",
    submenu: [
      {
        label: "Về chúng tôi",
        path: "/ve-chung-toi",
        type: "single",
      },
      {
        label: "Tầm nhìn sứ mệnh",
        path: "/ve-chung-toi/tam-nhin-su-menh",
        type: "single",
      },
      {
        label: "Giấy phép hoạt động, chứng chỉ",
        path: "/ve-chung-toi/giay-phep-hoat-dong-chung-chi",
        type: "single",
      },
      {
        label: "Cam kết chất lượng",
        path: "/ve-chung-toi/cam-ket-chat-luong",
        type: "single",
      },
      {
        label: "Tuyển dụng",
        path: "/ve-chung-toi/tuyen-dung",
        type: "single",
      },
    ],
  },
  {
    label: "Dịch Vụ",
    isUseSidebar: true,
    type: "category",
    submenu: [
      {
        label: "Thiết kế kiến trúc",
        path: "/dich-vu/thiet-ke-kien-truc",
        type: "category",
      },
      {
        label: "Thi công xây dựng",
        path: "/dich-vu/thi-cong-xay-dung",
        type: "category",
      },
      {
        label: "Sửa chữa cải tạo",
        path: "/dich-vu/sua-chua-ca-tao",
        type: "category",
      },
      {
        label: "Tư vấn giám sát công trình",
        path: "/dich-vu/tu-van-giam-sat-cong-trinh",
        type: "category",
      },
    ],
  },
  {
    label: "Mẫu Nhà Đẹp",
    isUseSidebar: false,
    type: "house-design",
    submenu: [
      {
        label: "Nhà phố",
        path: "/mau-nha-dep/nha-pho",
        type: "house-design",
      },
      {
        label: "Biệt thự",
        path: "/mau-nha-dep/biet-thu",
        type: "house-design",
      },
      {
        label: "Nhà cấp 4",
        path: "/mau-nha-dep/nha-cap-4",
        type: "house-design",
      },
      {
        label: "Nội thất",
        path: "/mau-nha-dep/noi-that",
        type: "house-design",
      },
      {
        label: "Phong cách thiết kế kiến trúc",
        path: "/mau-nha-dep/phong-cach-thiet-ke-kien-truc",
        type: "house-design",
      },
      {
        label: "Chung cư",
        path: "/mau-nha-dep/chung-cu",
        type: "house-design",
      },
    ],
  },
  {
    label: "Công Trình Xây Dựng Thực Tế",
    path: "/cong-trinh-xay-dung",
    isUseSidebar: true,
    type: "category",
  },
  {
    label: "Báo Giá",
    isUseSidebar: true,
    type: "single",
    submenu: [
      {
        label: "Báo giá thiết kế kiến trúc",
        path: "/bao-gia/thiet-ke-kien-truc",
        type: "single",
      },
      {
        label: "Báo giá thi công phần thô",
        path: "/bao-gia/thi-cong-phan-tho",
        type: "single",
      },
      {
        label: "Báo giá thi công trọn gói",
        path: "/bao-gia/thi-cong-trong-goi",
        type: "single",
      },
      {
        label: "File bảng giá tải về",
        path: "/bao-gia/download",
        type: "single",
      },
      {
        label: "Câu hỏi thường gặp (FAQ)",
        path: "/bao-gia/cau-hoi-thuong-gap",
        type: "single",
      },
    ],
  },
  {
    label: "Kinh Nghiệm & Blog",
    isUseSidebar: true,
    type: "category",
    submenu: [
      {
        label: "Cẩm nang xây dựng",
        path: "/blog/cam-nang-xay-dung",
        type: "category",
      },
      {
        label: "Hướng dẫn thủ tục pháp lý",
        path: "/blog/huong-dan-thu-tuc-phap-ly",
        type: "category",
      },
      {
        label: "Mẹo tiết kiệm chi phí",
        path: "/blog/cam-nang-tiet-kiem-chi-phi",
        type: "category",
      },
    ],
  },
  {
    label: "Liên Hệ",
    path: "/lien-he",
    isUseSidebar: true,
    type: "single",
  },
];

export default menuItems;
