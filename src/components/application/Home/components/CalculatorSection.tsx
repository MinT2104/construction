import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CalculatorSection = () => {
  return (
    <section className="py-16 -mt-8 relative z-10">
      <div className="container mx-auto px-4">
        <Card className="border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Left side - Introduction */}
            <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-8 lg:p-10 rounded-l-lg">
              <h2 className="text-3xl font-bold mb-6">
                Báo Giá Xây Dựng Nhanh
              </h2>
              <p className="text-white/90 mb-8 text-lg">
                Nhận báo giá chi tiết chỉ trong vài phút với công cụ tính toán
                chi phí thông minh của chúng tôi.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p>Báo giá chi tiết, minh bạch</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p>Đội ngũ kỹ sư giàu kinh nghiệm</p>
                </div>
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-4">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p>Cam kết tiến độ, phạt nếu chậm trễ</p>
                </div>
              </div>

              <Card className="bg-white p-4 border-0">
                <p className="font-medium text-lg mb-2">Hỗ trợ tư vấn 24/7</p>
                <p className="text-2xl font-bold">096 1993 915</p>
              </Card>
            </div>

            {/* Right side - Calculator Form */}
            <div className="col-span-2 p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Nhập thông tin để nhận báo giá chi tiết
              </h3>

              <form className="space-y-6">
                {/* Thông tin cơ bản */}
                <div>
                  <div className="font-bold text-gray-700 mb-4">
                    Thông tin cơ bản
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Chọn loại nhà:
                      </label>
                      <Select defaultValue="Nhà phố">
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại nhà" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nhà phố">Nhà phố</SelectItem>
                          <SelectItem value="Biệt thự">Biệt thự</SelectItem>
                          <SelectItem value="Nhà cấp 4">Nhà cấp 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Dịch vụ xây nhà:
                      </label>
                      <Select defaultValue="Xây nhà phần thô">
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn dịch vụ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Xây nhà phần thô">
                            Xây nhà phần thô
                          </SelectItem>
                          <SelectItem value="Xây nhà trọn gói">
                            Xây nhà trọn gói
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Mức đầu tư:
                      </label>
                      <Select defaultValue="Trung bình">
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn mức đầu tư" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Trung bình">Trung bình</SelectItem>
                          <SelectItem value="Trung bình - khá">
                            Trung bình - khá
                          </SelectItem>
                          <SelectItem value="Khá">Khá</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Mặt tiền:
                      </label>
                      <Select defaultValue="1">
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn số mặt tiền" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
                    <div className="lg:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Chiều rộng (Vd: 2.5m):
                      </label>
                      <Input
                        min={1}
                        type="number"
                        placeholder="Nhập chiều rộng"
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Chiều dài (Vd: 10.5m):
                      </label>
                      <Input
                        min={1}
                        type="number"
                        placeholder="Nhập chiều dài"
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Số tầng (Trừ tum, lửng):
                      </label>
                      <Input min={1} type="number" placeholder="Nhập số tầng" />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Hẻm:
                      </label>
                      <Select defaultValue="1">
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn số mặt tiền" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Rộng hơn 5m</SelectItem>
                          <SelectItem value="2">Rộng 3m - 5m</SelectItem>
                          <SelectItem value="3">Nhỏ hơn 3m</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Thông tin công năng - Collapsible */}
                <div className="w-full bg-gray-100 hover:bg-gray-200 transition-colors p-3 text-left font-bold text-gray-700 flex justify-between items-center">
                  Thông tin công năng
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Lửng (Vd: 30m2):
                    </label>
                    <Input min={1} type="number" placeholder="Nhập diện tích" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Tum (Vd: 30m2):
                    </label>
                    <Input min={1} type="number" placeholder="Nhập diện tích" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Sân thượng:
                    </label>
                    <Select defaultValue="Sân thượng">
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại sân thượng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sân thượng">Sân thượng</SelectItem>
                        <SelectItem value="Không có">Không có</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Ban công:
                    </label>
                    <Select defaultValue="Không có">
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại ban công" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Không có">Không có</SelectItem>
                        <SelectItem value="Có">Có</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Móng:
                    </label>
                    <Select defaultValue="Móng băng">
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại móng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Móng băng">Móng băng</SelectItem>
                        <SelectItem value="Móng đơn">Móng đơn</SelectItem>
                        <SelectItem value="Móng cọc">
                          Móng cọc (Móng đài)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Mái:
                    </label>
                    <Select defaultValue="Mái tôn">
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại mái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mái tôn">Mái tôn</SelectItem>
                        <SelectItem value="Mái bê tông cốt thép">
                          Mái BTCT
                        </SelectItem>
                        <SelectItem value="Mái xà gồ + ngói">
                          Mái xà gồ + ngói
                        </SelectItem>
                        <SelectItem value="Mái BTCT + ngói">
                          Mái BTCT + ngói
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Tầng hầm:
                    </label>
                    <Select defaultValue="Không hầm">
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại tầng hầm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Không hầm">Không hầm</SelectItem>
                        <SelectItem value="Độ sâu 1.0 - 1.2">
                          Độ sâu 1.0 - 1.2
                        </SelectItem>
                        <SelectItem value="Độ sâu 1.2 - 1.5">
                          Độ sâu 1.2 - 1.5
                        </SelectItem>
                        <SelectItem value="Độ sâu 1.5 - 1.7">
                          Độ sâu 1.5 - 1.7
                        </SelectItem>
                        <SelectItem value="Độ sâu 1.7 - 2.0">
                          Độ sâu 1.7 - 2.0
                        </SelectItem>
                        <SelectItem value="Độ sâu 2.0 - 2.5">
                          Độ sâu 2.0 - 2.5
                        </SelectItem>
                        <SelectItem value="Độ sâu 2.5 - 3.0">
                          Độ sâu 2.5 - 3.0
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Sân vườn (Vd: 10m2):
                    </label>
                    <Input min={1} type="number" placeholder="Nhập diện tích" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full font-semibold"
                    >
                      Tính Kết Quả
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CalculatorSection;
