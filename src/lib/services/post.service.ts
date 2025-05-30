export async function fetchPostBySlug(slug: string) {
  // Fake fetch - real data style
  return {
    id: "post-001",
    title: "7 Lưu Ý Quan Trọng Khi Thiết Kế Kiến Trúc Nhà Phố",
    content: `
        Khi thiết kế kiến trúc cho nhà phố, có rất nhiều yếu tố cần được xem xét như diện tích, công năng, ánh sáng tự nhiên, và cả phong thủy.
        Bài viết này sẽ giúp bạn hiểu rõ 7 lưu ý quan trọng để có một ngôi nhà vừa thẩm mỹ, vừa tối ưu chi phí xây dựng.
      `,
    createdAt: "2024-11-15T10:00:00Z",
    updatedAt: "2025-01-02T12:30:00Z",
    author: "Nguyễn Minh Tuấn",
    tags: ["thiết kế", "kiến trúc", "nhà phố", "xây dựng"],
    image: "/images/houses/house_1.avif",
    readingTime: "6 phút",
    views: 1572,
    commentsCount: 12,
  };
}

export async function fetchPostsByCategory(categorySlug: string) {
  console.log("categorySlug", categorySlug);
  return [
    {
      id: "post-001",
      title: "7 Lưu Ý Quan Trọng Khi Thiết Kế Kiến Trúc Nhà Phố",
      content:
        "Tối ưu không gian sống, chọn vật liệu và phong thủy là những điều bạn không nên bỏ qua...",
      createdAt: "2024-11-15T10:00:00Z",
      updatedAt: "2025-01-02T12:30:00Z",
      author: "Nguyễn Minh Tuấn",
      tags: ["thiết kế", "kiến trúc", "nhà phố"],
      image: "/images/houses/house_1.avif",
    },
    {
      id: "post-002",
      title: "Tổng Hợp 5 Phong Cách Thiết Kế Nội Thất Được Ưa Chuộng 2025",
      content:
        "Phong cách tối giản, hiện đại hay Bắc Âu đang được nhiều người lựa chọn cho không gian sống...",
      createdAt: "2025-01-01T09:20:00Z",
      updatedAt: "2025-01-05T10:00:00Z",
      author: "Lê Thị Ngọc Hà",
      tags: ["nội thất", "phong cách", "decor"],
      image: "/images/houses/house_2.avif",
    },
    {
      id: "post-003",
      title: "5 Sai Lầm Khi Tự Thiết Kế Nhà Mà Ai Cũng Gặp",
      content:
        "Thiếu kinh nghiệm, sai tỷ lệ, không chú ý đến hướng nắng… là những sai lầm phổ biến cần tránh.",
      createdAt: "2024-12-12T14:10:00Z",
      updatedAt: "2024-12-20T09:00:00Z",
      author: "Trần Văn Khánh",
      tags: ["thiết kế sai", "xây dựng", "kiến thức"],
      image: "/images/houses/house_3.avif",
    },
    {
      id: "post-004",
      title: "Tối Ưu Hóa Không Gian Nhỏ Với Thiết Kế Thông Minh",
      content:
        "Nhà nhỏ vẫn tiện nghi nếu biết cách tận dụng nội thất thông minh và bố trí hợp lý...",
      createdAt: "2025-01-07T08:00:00Z",
      updatedAt: "2025-01-08T15:30:00Z",
      author: "Nguyễn Phương Anh",
      tags: ["không gian nhỏ", "smart design"],
      image: "/images/houses/house_4.avif",
    },
    {
      id: "post-005",
      title: "Xu Hướng Thiết Kế Nhà Ở 2025: Bền Vững & Thân Thiện Môi Trường",
      content:
        "Vật liệu xanh, tối ưu năng lượng và hòa hợp thiên nhiên sẽ là xu hướng trong năm 2025...",
      createdAt: "2025-01-03T16:00:00Z",
      updatedAt: "2025-01-04T10:15:00Z",
      author: "Phạm Văn Duy",
      tags: ["xanh", "bền vững", "xu hướng 2025"],
      image: "/images/houses/house_5.avif",
    },
    {
      id: "post-006",
      title: "Giải Pháp Chiếu Sáng Tự Nhiên Cho Nhà Phố Đông Người",
      content:
        "Chiếu sáng tự nhiên không chỉ giúp tiết kiệm điện mà còn tốt cho sức khỏe và tinh thần...",
      createdAt: "2024-10-22T11:30:00Z",
      updatedAt: "2024-10-25T08:00:00Z",
      author: "Đỗ Thị Mai",
      tags: ["ánh sáng", "thiết kế thông minh"],
      image: "/images/houses/house_6.avif",
    },
  ];
}
