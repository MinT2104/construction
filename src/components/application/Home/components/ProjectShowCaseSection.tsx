import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mở rộng dữ liệu dự án với thêm thông tin chi tiết
const projects = [
  {
    title: "Biệt Thự Hiện Đại Quận 9",
    description: "Biệt thự 3 tầng phong cách hiện đại với diện tích 300m²",
    image: "/images/villa.avif",
    owner: "Bà. Trịnh Khánh Hạ",
    location: "Xã Trung Chánh, Huyện Hóc Môn, TPHCM",
    size: "Nhà phố 1 trệt 2 lầu",
    dimensions: "7x18m",
  },
  {
    title: "Nhà Phố Tân Cổ Điển Quận 7",
    description: "Nhà phố 4 tầng phong cách tân cổ điển với diện tích 100m²",
    image: "/images/townhouse.jpg",
    owner: "Ông. Nguyễn Ngọc Vũ Nam",
    location: "Phường Bình Trị Đông, Quận Bình Tân, TPHCM",
    size: "Nhà 1 trệt lửng 3 lầu tum sân thượng",
    dimensions: "5x20m",
  },
  {
    title: "Văn Phòng Công Ty ABC",
    description: "Thiết kế và thi công văn phòng hiện đại với diện tích 500m²",
    image: "/images/office.avif",
    owner: "Ông. Thành",
    location: "Quận 12, TPHCM",
    size: "Nhà 2 mặt tiền 4 tầng",
    dimensions: "8x16m",
  },
  {
    title: "Nhà Phố Hiện Đại Quận 2",
    description: "Nhà phố 3 tầng phong cách hiện đại với diện tích 120m²",
    image: "/images/villa.avif",
    owner: "Ông. Nguyễn Hữu Bình",
    location: "Đường số 19, P. Tân Quy, Q.7, TPHCM",
    size: "Nhà 3 tầng",
    dimensions: "9x17m",
  },
  {
    title: "Biệt Thự Vườn Thủ Đức",
    description: "Biệt thự vườn phong cách hiện đại với diện tích 400m²",
    image: "/images/villa.avif",
    owner: "Bà. Phạm Thị Thanh Hương",
    location: "Phường Linh Đông, TP. Thủ Đức, TPHCM",
    size: "Biệt thự 2 tầng có sân vườn",
    dimensions: "15x20m",
  },
  {
    title: "Nhà Phố Phong Cách Minimalist",
    description: "Nhà phố tối giản với không gian mở diện tích 150m²",
    image: "/images/townhouse.jpg",
    owner: "Ông. Lê Minh Tuấn",
    location: "Phường 15, Quận 10, TPHCM",
    size: "Nhà phố 1 trệt 3 lầu",
    dimensions: "4.5x18m",
  },
  {
    title: "Showroom Nội Thất XYZ",
    description: "Thiết kế showroom trưng bày nội thất cao cấp 600m²",
    image: "/images/office.avif",
    owner: "Công ty TNHH XYZ",
    location: "Quận 1, TPHCM",
    size: "Showroom 2 tầng",
    dimensions: "12x25m",
  },
  {
    title: "Căn Hộ Duplex Quận 4",
    description: "Thiết kế và thi công căn hộ duplex sang trọng 200m²",
    image: "/images/villa.avif",
    owner: "Ông. Trần Đức Minh",
    location: "Phường 3, Quận 4, TPHCM",
    size: "Căn hộ 2 tầng",
    dimensions: "12x15m",
  },
];

const slugify = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

const ProjectShowCaseSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Tiêu đề */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary uppercase mb-2">
            Công Trình Xây Dựng Tiêu Biểu
          </h2>
          <div className="flex items-center justify-center">
            <div className="h-0.5 bg-primary w-16"></div>
            <p className="mx-4 text-muted-foreground">
              Các công trình đã hoàn thành của công ty
            </p>
            <div className="h-0.5 bg-primary w-16"></div>
          </div>
        </div>

        {/* Grid dự án */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project) => {
            const slug = slugify(project.title);
            return (
              <Card
                key={project.title}
                className="overflow-hidden bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Logo overlay */}
                <div className="relative">
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-white/80 p-1 rounded">
                      <Image
                        src="/images/logo.png"
                        alt="Việt Quang Logo"
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>

                  {/* Hình ảnh dự án */}
                  <Link href={`/projects/${slug}`} className="block">
                    <div className="relative w-full h-64 overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                </div>

                {/* Thông tin dự án */}
                <CardContent className="p-4">
                  <Link href={`/projects/${slug}`}>
                    <CardTitle className="text-primary font-bold text-lg mb-2 hover:text-primary/80 transition-colors">
                      {project.title}
                    </CardTitle>
                  </Link>

                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Chủ đầu tư:</span>{" "}
                      {project.owner}
                    </p>
                    <p>
                      <span className="font-semibold">Địa điểm:</span>{" "}
                      {project.location}
                    </p>
                    <p>
                      <span className="font-semibold">Quy mô:</span>{" "}
                      {project.size}
                    </p>
                    {project.dimensions && (
                      <p>
                        <span className="font-semibold">Kích thước:</span>{" "}
                        {project.dimensions}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Nút xem tất cả */}
        <div className="text-center mt-12">
          <Button
            asChild
            variant="default"
            className="bg-primary text-white hover:bg-primary/90 px-6 py-4 h-auto text-base font-medium"
          >
            <Link href="/xay-nha/cong-trinh-tieu-bieu">
              Xem tất cả công trình
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectShowCaseSection;
