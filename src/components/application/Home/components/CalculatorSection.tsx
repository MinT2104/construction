"use client";

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
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { 
  constructionTypesData, 
  buildPackagesData, 
  investmentLevelsData, 
  coefficientsData,
  priceListData,
  additionalFactors
} from "@/lib/mockdata/constructionData";

interface ConstructionType {
  _id: string;
  name: string;
}

interface BuildPackage {
  _id: string;
  name: string;
}

interface InvestmentLevel {
  _id: string;
  name: string;
}

interface Coefficient {
  _id: string;
  code: string;
  name: string;
  coefficient: number;
  notes?: string;
}

interface CalculationResult {
  total_cost: number;
  area: number;
  unit_price: number;
  details: {
    [key: string]: {
      area: number;
      coefficient: number;
      unit_price: number;
      subtotal: number;
    };
  };
}

const CalculatorSection = () => {
  // State for form data
  const [width, setWidth] = useState<number | "">("");
  const [length, setLength] = useState<number | "">("");
  const [floors, setFloors] = useState<number | "">("");
  const [loftArea, setLoftArea] = useState<number | "">("");
  const [atticArea, setAtticArea] = useState<number | "">("");
  const [gardenArea, setGardenArea] = useState<number | "">("");
  const [constructionType, setConstructionType] = useState<string>("");
  const [buildPackage, setBuildPackage] = useState<string>("");
  const [investmentLevel, setInvestmentLevel] = useState<string>("");
  const [frontage, setFrontage] = useState<string>("1");
  const [alley, setAlley] = useState<string>("1");
  const [terrace, setTerrace] = useState<string>("Sân thượng");
  const [balcony, setBalcony] = useState<string>("Không có");
  const [foundation, setFoundation] = useState<string>("Móng băng");
  const [roof, setRoof] = useState<string>("Mái tôn");
  const [basement, setBasement] = useState<string>("Không hầm");

  // State for dropdown options
  const [constructionTypes, setConstructionTypes] = useState<ConstructionType[]>(constructionTypesData);
  const [buildPackages, setBuildPackages] = useState<BuildPackage[]>(buildPackagesData);
  const [investmentLevels, setInvestmentLevels] = useState<InvestmentLevel[]>(investmentLevelsData);
  const [coefficients, setCoefficients] = useState<Coefficient[]>(coefficientsData);

  // State for API interaction
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingOptions, setLoadingOptions] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Set default values
  useEffect(() => {
    if (constructionTypes.length > 0) setConstructionType(constructionTypes[0]._id);
    if (buildPackages.length > 0) setBuildPackage(buildPackages[0]._id);
    if (investmentLevels.length > 0) setInvestmentLevel(investmentLevels[0]._id);
  }, []);

  // Handle calculation
  const handleCalculate = async () => {
    if (!width || !length || !floors) {
      setError('Vui lòng nhập chiều rộng, chiều dài và số tầng.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Mô phỏng gọi API
      setTimeout(() => {
        // 1. Tìm đơn giá cơ bản dựa trên loại nhà, gói xây dựng và mức đầu tư
        const selectedPrice = priceListData.find(
          price => 
            price.constructionTypeId._id === constructionType && 
            price.buildPackageId._id === buildPackage && 
            price.investmentLevelId._id === investmentLevel
        );
        
        // Nếu không tìm thấy đơn giá phù hợp, sử dụng đơn giá mặc định
        let baseUnitPrice = selectedPrice ? selectedPrice.pricePerM2 : 5500000;
        
        // 2. Áp dụng hệ số bổ sung cho mặt tiền và hẻm
        const frontageCoefficient = additionalFactors.frontage[frontage as keyof typeof additionalFactors.frontage] || 1.0;
        const alleyCoefficient = additionalFactors.alley[alley as keyof typeof additionalFactors.alley] || 1.0;
        
        // Tính đơn giá sau khi áp dụng hệ số bổ sung
        const adjustedUnitPrice = baseUnitPrice * frontageCoefficient * alleyCoefficient;
        
        // 3. Xác định mã code cho loại móng
        let foundationCode = "foundation_bang"; // Mặc định là móng băng
        if (foundation === "Móng cọc") {
          foundationCode = "foundation_coc";
        } else if (foundation === "Móng đơn") {
          foundationCode = "foundation_don";
        }
        
        // 4. Xác định mã code cho loại mái
        let roofCode = "roof_ton"; // Mặc định là mái tôn
        if (roof === "Mái bê tông cốt thép") {
          roofCode = "roof_btct";
        } else if (roof === "Mái xà gồ + ngói" || roof === "Mái BTCT + ngói") {
          roofCode = "roof_tile";
        }
        
        // 5. Tìm hệ số cho các hạng mục
        const getCoefficient = (code: string) => {
          const item = coefficients.find(c => c.code === code);
          return item ? item.coefficient : 1;
        };
        
        // 6. Tính diện tích cơ bản
        const baseArea = Number(width) * Number(length);
        
        // 7. Tạo chi tiết các hạng mục
        const details: Record<string, any> = {};
        let totalAdjustedArea = 0;
        
        // 8. Thêm tầng trệt và các tầng
        for (let i = 0; i < Number(floors); i++) {
          const floorKey = i === 0 ? "floor" : `floor_${i+1}`;
          const floorCoefficient = getCoefficient("floor");
          const floorArea = baseArea;
          const floorAdjustedArea = floorArea * floorCoefficient;
          
          details[floorKey] = {
            area: floorArea,
            coefficient: floorCoefficient,
            unit_price: adjustedUnitPrice,
            subtotal: floorAdjustedArea * adjustedUnitPrice
          };
          
          totalAdjustedArea += floorAdjustedArea;
        }
        
        // 9. Thêm lửng nếu có
        if (loftArea && Number(loftArea) > 0) {
          const loftCoefficient = getCoefficient("loft");
          const loftAdjustedArea = Number(loftArea) * loftCoefficient;
          
          details["loft"] = {
            area: Number(loftArea),
            coefficient: loftCoefficient,
            unit_price: adjustedUnitPrice,
            subtotal: loftAdjustedArea * adjustedUnitPrice
          };
          
          totalAdjustedArea += loftAdjustedArea;
        }
        
        // 10. Thêm tum nếu có
        if (atticArea && Number(atticArea) > 0) {
          const atticCoefficient = getCoefficient("attic");
          const atticAdjustedArea = Number(atticArea) * atticCoefficient;
          
          details["attic"] = {
            area: Number(atticArea),
            coefficient: atticCoefficient,
            unit_price: adjustedUnitPrice,
            subtotal: atticAdjustedArea * adjustedUnitPrice
          };
          
          totalAdjustedArea += atticAdjustedArea;
        }
        
        // 11. Thêm mái
        const roofCoefficient = getCoefficient(roofCode);
        const roofAdjustedArea = baseArea * roofCoefficient;
        
        details[roofCode] = {
          area: baseArea,
          coefficient: roofCoefficient,
          unit_price: adjustedUnitPrice,
          subtotal: roofAdjustedArea * adjustedUnitPrice
        };
        
        totalAdjustedArea += roofAdjustedArea;
        
        // 12. Thêm móng
        const foundationCoefficient = getCoefficient(foundationCode);
        const foundationAdjustedArea = baseArea * foundationCoefficient;
        
        details[foundationCode] = {
          area: baseArea,
          coefficient: foundationCoefficient,
          unit_price: adjustedUnitPrice,
          subtotal: foundationAdjustedArea * adjustedUnitPrice
        };
        
        totalAdjustedArea += foundationAdjustedArea;
        
        // 13. Thêm ban công nếu có
        if (balcony === "Có") {
          const balconyCoefficient = getCoefficient("balcony");
          const balconyArea = Number(width) * 1.5; // Giả định chiều sâu ban công là 1.5m
          const balconyAdjustedArea = balconyArea * balconyCoefficient;
          
          details["balcony"] = {
            area: balconyArea,
            coefficient: balconyCoefficient,
            unit_price: adjustedUnitPrice,
            subtotal: balconyAdjustedArea * adjustedUnitPrice
          };
          
          totalAdjustedArea += balconyAdjustedArea;
        }
        
        // 14. Thêm sân thượng nếu có
        if (terrace === "Sân thượng") {
          const terraceCoefficient = getCoefficient("terrace");
          const terraceAdjustedArea = baseArea * terraceCoefficient;
          
          details["terrace"] = {
            area: baseArea,
            coefficient: terraceCoefficient,
            unit_price: adjustedUnitPrice,
            subtotal: terraceAdjustedArea * adjustedUnitPrice
          };
          
          totalAdjustedArea += terraceAdjustedArea;
        }
        
        // 15. Thêm sân vườn nếu có
        if (gardenArea && Number(gardenArea) > 0) {
          const gardenCoefficient = getCoefficient("garden");
          const gardenAdjustedArea = Number(gardenArea) * gardenCoefficient;
          
          details["garden"] = {
            area: Number(gardenArea),
            coefficient: gardenCoefficient,
            unit_price: adjustedUnitPrice,
            subtotal: gardenAdjustedArea * adjustedUnitPrice
          };
          
          totalAdjustedArea += gardenAdjustedArea;
        }
        
        // 16. Thêm tầng hầm nếu có
        if (basement !== "Không hầm") {
          const basementDepthCoefficient = additionalFactors.basement_depth[basement as keyof typeof additionalFactors.basement_depth] || 1.5;
          const basementAdjustedArea = baseArea * basementDepthCoefficient;
          
          details["basement"] = {
            area: baseArea,
            coefficient: basementDepthCoefficient,
            unit_price: adjustedUnitPrice,
            subtotal: basementAdjustedArea * adjustedUnitPrice
          };
          
          totalAdjustedArea += basementAdjustedArea;
        }
        
        // 17. Tính tổng chi phí
        let totalCost = 0;
        Object.values(details).forEach((item: any) => {
          totalCost += item.subtotal;
        });
        
        // 18. Tạo kết quả
        const mockResult: CalculationResult = {
          total_cost: totalCost,
          area: totalAdjustedArea,
          unit_price: adjustedUnitPrice,
          details: details
        };
        
        setResult(mockResult);
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tính toán chi phí');
      console.error('Error calculating cost:', err);
      setLoading(false);
    }
  };

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

              {loadingOptions ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Đang tải dữ liệu...</span>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleCalculate(); }}>
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
                        <Select 
                          value={constructionType} 
                          onValueChange={setConstructionType}
                        >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại nhà" />
                        </SelectTrigger>
                        <SelectContent>
                            {constructionTypes.map(type => (
                              <SelectItem key={type._id} value={type._id}>
                                {type.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Dịch vụ xây nhà:
                      </label>
                        <Select 
                          value={buildPackage} 
                          onValueChange={setBuildPackage}
                        >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn dịch vụ" />
                        </SelectTrigger>
                        <SelectContent>
                            {buildPackages.map(pkg => (
                              <SelectItem key={pkg._id} value={pkg._id}>
                                {pkg.name}
                          </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Mức đầu tư:
                      </label>
                        <Select 
                          value={investmentLevel} 
                          onValueChange={setInvestmentLevel}
                        >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn mức đầu tư" />
                        </SelectTrigger>
                        <SelectContent>
                            {investmentLevels.map(level => (
                              <SelectItem key={level._id} value={level._id}>
                                {level.name}
                          </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Mặt tiền:
                      </label>
                        <Select value={frontage} onValueChange={setFrontage}>
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
                          value={width}
                          onChange={(e) => setWidth(e.target.value ? Number(e.target.value) : "")}
                          required
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
                          value={length}
                          onChange={(e) => setLength(e.target.value ? Number(e.target.value) : "")}
                          required
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Số tầng (Trừ tum, lửng):
                      </label>
                        <Input 
                          min={1} 
                          type="number" 
                          placeholder="Nhập số tầng" 
                          value={floors}
                          onChange={(e) => setFloors(e.target.value ? Number(e.target.value) : "")}
                          required
                        />
                    </div>
                    <div className="lg:col-span-2">
                      <label className="block text-gray-700 text-sm font-medium mb-1">
                        Hẻm:
                      </label>
                        <Select value={alley} onValueChange={setAlley}>
                        <SelectTrigger>
                            <SelectValue placeholder="Chọn loại hẻm" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Rộng hơn 5m</SelectItem>
                          <SelectItem value="2">Rộng 3m - 5m</SelectItem>
                            <SelectItem value="3">Hẻm nhỏ: +5%</SelectItem>
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
                      <Input 
                        min={0} 
                        type="number" 
                        placeholder="Nhập diện tích" 
                        value={loftArea}
                        onChange={(e) => setLoftArea(e.target.value ? Number(e.target.value) : "")}
                      />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Tum (Vd: 30m2):
                    </label>
                      <Input 
                        min={0} 
                        type="number" 
                        placeholder="Nhập diện tích" 
                        value={atticArea}
                        onChange={(e) => setAtticArea(e.target.value ? Number(e.target.value) : "")}
                      />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Sân thượng:
                    </label>
                      <Select value={terrace} onValueChange={setTerrace}>
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
                      <Select value={balcony} onValueChange={setBalcony}>
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
                      <Select value={foundation} onValueChange={setFoundation}>
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
                      <Select value={roof} onValueChange={setRoof}>
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
                      <Select value={basement} onValueChange={setBasement}>
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
                      <Input 
                        min={0} 
                        type="number" 
                        placeholder="Nhập diện tích" 
                        value={gardenArea}
                        onChange={(e) => setGardenArea(e.target.value ? Number(e.target.value) : "")}
                      />
                    </div>
                  </div>

                  {/* Error display */}
                  {error && (
                    <Alert variant="destructive" className="my-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Results display */}
                  {result && (
                    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Kết quả ước tính</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500">Tổng diện tích quy đổi</p>
                          <p className="text-2xl font-bold">{result.area.toLocaleString()} m²</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-500">Đơn giá áp dụng</p>
                          <p className="text-2xl font-bold">{result.unit_price.toLocaleString()} VNĐ/m²</p>
                          <div className="mt-1 text-xs text-gray-500">
                            {frontage === "2" && <span className="inline-block mr-2 bg-blue-100 text-blue-800 px-1 rounded">Mặt tiền: +5%</span>}
                            {alley === "2" && <span className="inline-block mr-2 bg-blue-100 text-blue-800 px-1 rounded">Hẻm 3-5m: +2%</span>}
                            {alley === "3" && <span className="inline-block mr-2 bg-blue-100 text-blue-800 px-1 rounded">Hẻm nhỏ: +5%</span>}
                          </div>
                        </div>
                        <div className="p-4 bg-white rounded-lg border border-primary text-primary">
                          <p className="text-sm">Tổng chi phí ước tính</p>
                          <p className="text-2xl font-bold">{result.total_cost.toLocaleString()} VNĐ</p>
                          <p className="text-xs mt-1">
                            {constructionTypes.find(t => t._id === constructionType)?.name} - {buildPackages.find(p => p._id === buildPackage)?.name} - {investmentLevels.find(l => l._id === investmentLevel)?.name}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h5 className="font-semibold text-gray-700 mb-2">Chi tiết các hạng mục</h5>
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="py-2 px-4 text-left">Hạng mục</th>
                                <th className="py-2 px-4 text-right">Diện tích (m²)</th>
                                <th className="py-2 px-4 text-right">Hệ số</th>
                                <th className="py-2 px-4 text-right">Đơn giá (VNĐ/m²)</th>
                                <th className="py-2 px-4 text-right">Thành tiền (VNĐ)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(result.details).map(([key, item]) => {
                                const coefficient = coefficients.find(c => c.code === key);
                                // Xử lý tên hiển thị cho các tầng
                                let displayName = coefficient?.name || key;
                                if (key.startsWith("floor_")) {
                                  const floorNumber = key.split("_")[1];
                                  displayName = `Tầng ${floorNumber}`;
                                }
                                
                                return (
                                  <tr key={key} className="border-t border-gray-100">
                                    <td className="py-2 px-4">{displayName}</td>
                                    <td className="py-2 px-4 text-right">{item.area.toLocaleString()}</td>
                                    <td className="py-2 px-4 text-right">{item.coefficient}</td>
                                    <td className="py-2 px-4 text-right">{item.unit_price.toLocaleString()}</td>
                                    <td className="py-2 px-4 text-right">{item.subtotal.toLocaleString()}</td>
                                  </tr>
                                );
                              })}
                              <tr className="border-t border-gray-300 font-bold">
                                <td className="py-2 px-4">Tổng cộng</td>
                                <td className="py-2 px-4 text-right">{result.area.toLocaleString()}</td>
                                <td className="py-2 px-4 text-right">-</td>
                                <td className="py-2 px-4 text-right">-</td>
                                <td className="py-2 px-4 text-right">{result.total_cost.toLocaleString()}</td>
                              </tr>
                            </tbody>
                          </table>
                  </div>
                </div>
                      
                      <div className="mt-4 text-sm text-gray-600">
                        <p className="font-medium mb-1">Ghi chú:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Báo giá trên là ước tính sơ bộ dựa trên thông tin bạn cung cấp.</li>
                          <li>Chi phí thực tế có thể thay đổi tùy theo điều kiện công trình và yêu cầu cụ thể.</li>
                          <li>Để nhận báo giá chính xác, vui lòng liên hệ với đội ngũ tư vấn của chúng tôi.</li>
                        </ul>
                      </div>
                    </div>
                  )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <Button
                        type="submit"
                      className="w-full font-semibold"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang tính...
                          </>
                        ) : (
                          "Tính Kết Quả"
                        )}
                    </Button>
                  </div>
                </div>
              </form>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CalculatorSection;
