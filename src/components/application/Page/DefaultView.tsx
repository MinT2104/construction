import React from "react";
import { BaseMenuItem } from "@/lib/types/common/menu.interface";
import { SectionHeader } from "./components";

interface DefaultViewProps {
  currentItem: BaseMenuItem;
}

const DefaultView: React.FC<DefaultViewProps> = ({ currentItem }) => {
  return (
    <div className="prose prose-slate max-w-none">
      <SectionHeader
        title={currentItem.label}
        variant="primary"
        subtitle="Thông tin chi tiết về các dịch vụ và giải pháp tốt nhất của chúng tôi"
      />

      <div className="mt-6">
        <p>Nội dung cho trang: {currentItem.label}</p>
      </div>
    </div>
  );
};

export default DefaultView;
