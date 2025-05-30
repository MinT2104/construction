import { MenuItemType } from "../types/common/menu.interface";

const menuItems: MenuItemType[] = [
  {
    label: "Giới thiệu",
    path: "/gioi-thieu",
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
    label: "Thiết kế",
    path: "/thiet-ke",
    isUseSidebar: true,
    type: "category",
    submenu: [
      {
        label: "Thiết kế biệt thự",
        path: "/thiet-ke/thiet-ke-biet-thu",
        type: "category",
      },
      {
        label: "Thiết kế nhà phố",
        path: "/thiet-ke/thiet-ke-nha-pho",
        type: "category",
      },
      {
        label: "Thiết kế nội thất",
        path: "/thiet-ke/thiet-ke-noi-that",
        type: "category",
      },
      {
        label: "Quy trình thiết kế",
        path: "/thiet-ke/quy-trinh-thiet-ke",
        type: "category",
      },
      {
        label: "Những lưu ý khi thiết kế",
        path: "/thiet-ke/nhung-luu-y-khi-thiet-ke",
        type: "category",
      },
    ],
  },
  {
    label: "Xây nhà",
    path: "/xay-nha",
    isUseSidebar: true,
    type: "category",
    submenu: [
      {
        label: "Công trình tiêu biểu",
        path: "/xay-nha/cong-trinh-tieu-bieu",
        type: "category",
      },
      {
        label: "Xây nhà tại TP HCM",
        path: "/xay-nha/xay-nha-tai-tp-hcm",
        type: "category",
      },
      {
        label: "Xây dựng nhà đẹp",
        path: "/xay-nha/xay-dung-nha-dep",
        type: "category",
      },
      {
        label: "Công trình đã hoàn thành",
        path: "/xay-nha/cong-trinh-da-hoan-thanh",
        type: "category",
      },
      {
        label: "Quy trình xây dựng",
        path: "/xay-nha/quy-trinh-xay-dung",
        type: "category",
      },
      {
        label: "Chi phí xây nhà phố",
        path: "/xay-nha/chi-phi-xay-nha-pho",
        type: "category",
      },
      {
        label: "Những lưu ý khi xây nhà",
        path: "/xay-nha/nhung-luu-y-khi-xay-nha",
        type: "category",
      },
    ],
  },
  {
    label: "Sửa nhà",
    path: "/sua-nha",
    isUseSidebar: true,
    type: "category",
    submenu: [
      {
        label: "Đơn giá sửa nhà các quận tại TP HCM",
        path: "/sua-nha/don-gia-sua-nha-cac-quan-tai-tp-hcm",
        type: "category",
      },
      {
        label: "Công trình đã hoàn thành",
        path: "/sua-nha/cong-trinh-da-hoan-thanh",
        type: "category",
      },
      {
        label: "Sửa nhà nâng tầng",
        path: "/sua-nha/quy-trinh-sua-nha",
        type: "category",
      },
    ],
  },
  {
    label: "Mẫu Nhà Đẹp",
    path: "/mau-nha-dep",
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
  // tư vấn giám sát
  {
    label: "Tư vấn giám sát",
    path: "/tu-van-giam-sat",
    isUseSidebar: true,
    type: "category",
  },
  {
    label: "Báo Giá",
    path: "/bao-gia",
    isUseSidebar: true,
    type: "single",
    submenu: [
      {
        label: "Thiết kế nhà",
        path: "/bao-gia/thiet-ke-nha",
        type: "single",
      },
      {
        label: "Xây nhà trọn gói",
        path: "/bao-gia/xay-nha-tron-goi",
        type: "single",
      },
      {
        label: "Xây nhà phần thô",
        path: "/bao-gia/xay-nha-phan-tho",
        type: "single",
      },
      {
        label: "Hoàn thiện nhà ở",
        path: "/bao-gia/download",
        type: "single",
      },
      {
        label: "Sửa nhà trọn gói",
        path: "/bao-gia/sua-nha-tron-goi",
        type: "single",
      },
    ],
  },
  {
    label: "Cẩm nang XD",
    path: "/cam-nang",
    isUseSidebar: true,
    type: "category",
    submenu: [
      {
        label: "Luật xây dựng nhà ở",
        path: "/cam-nang/luat-xay-dung-nha-o",
        type: "category",
      },
      {
        label: "Cẩm nang xây nhà",
        path: "/cam-nang/cam-nang-xay-nha",
        type: "category",
      },
      {
        label: "Tư vấn sửa nhà",
        path: "/cam-nang/tu-van-sua-nha",
        type: "category",
      },
      {
        label: "Phong thủy",
        path: "/cam-nang/phong-thuy",
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
