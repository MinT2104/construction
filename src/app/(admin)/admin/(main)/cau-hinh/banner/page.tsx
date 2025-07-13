"use client";

import { useEffect, useState, useRef } from "react";
import { bannerService } from "@/lib/services/banner.service";
import { Banner, HeroItem } from "@/lib/types/modules/banner.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import {
  Loader2,
  UploadCloud,
  XCircle,
  EyeOff,
  Eye,
  Trash2,
  PencilLine,
  MoveUp,
  MoveDown,
  Plus,
  AlertTriangle,
} from "lucide-react";
import MediaService from "@/lib/services/media.service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

const AdminBannerPage = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploadingHeader, setIsUploadingHeader] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingHero, setEditingHero] = useState<HeroItem | null>(null);
  const [newHeroName, setNewHeroName] = useState("");
  const [newHeroUrl, setNewHeroUrl] = useState("");
  const [newHeroVisible, setNewHeroVisible] = useState(true);

  // Separate state for edit form
  const [editHeroName, setEditHeroName] = useState("");
  const [editHeroUrl, setEditHeroUrl] = useState("");
  const [editHeroVisible, setEditHeroVisible] = useState(true);
  const [isUploadingEditHero, setIsUploadingEditHero] = useState(false);

  const [previewMode, setPreviewMode] = useState(false);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Confirm dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  const headerImageInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const editHeroImageInputRef = useRef<HTMLInputElement>(null);

  const fetchBanner = async () => {
    setLoading(true);
    try {
      const data = await bannerService.getAllBanner();
      setBanner(data);
    } catch (error) {
      console.error("Error fetching banner data:", error);
      toast.error("Không thể tải dữ liệu banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  // Confirm dialog functions
  const showConfirm = (title: string, message: string, action: () => void) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmDialog(true);
  };

  const handleConfirmYes = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const handleConfirmNo = () => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  // Header Banner Functions
  const uploadHeaderBanner = async (file: File) => {
    if (!file) return;
    setIsUploadingHeader(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await MediaService.upload(formData);
      let imageUrl = "";
      if (response && response.data && response.data.url) {
        imageUrl = response.data.url;
      } else if (response && response.url) {
        imageUrl = response.url;
      } else {
        throw new Error("Không nhận được URL ảnh từ server");
      }

      await bannerService.updateHeaderBanner(imageUrl);
      toast.success("Cập nhật banner header thành công!");
      fetchBanner();
    } catch (error) {
      console.error("Lỗi khi tải lên banner header:", error);
      toast.error("Cập nhật banner header thất bại");
    } finally {
      setIsUploadingHeader(false);
    }
  };

  const removeHeaderBanner = async () => {
    try {
      setBanner((prev) => ({
        ...prev,
        headerBanner: undefined,
        heroBanner: prev?.heroBanner || [],
      }));
    } catch (error) {
      console.error("Lỗi khi xóa banner header:", error);
      toast.error("Xóa banner header thất bại");
    }
  };

  // Hero Banner Functions
  const uploadHeroImage = async (file: File) => {
    if (!file) return;
    setIsUploadingHero(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await MediaService.upload(formData);
      let imageUrl = "";
      if (response && response.data && response.data.url) {
        imageUrl = response.data.url;
      } else if (response && response.url) {
        imageUrl = response.url;
      } else {
        throw new Error("Không nhận được URL ảnh từ server");
      }

      setNewHeroUrl(imageUrl);
    } catch (error) {
      console.error("Lỗi khi tải lên hình ảnh hero banner:", error);
      toast.error("Tải lên hình ảnh hero banner thất bại");
    } finally {
      setIsUploadingHero(false);
    }
  };

  const uploadEditHeroImage = async (file: File) => {
    if (!file) return;
    setIsUploadingEditHero(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await MediaService.upload(formData);
      let imageUrl = "";
      if (response && response.data && response.data.url) {
        imageUrl = response.data.url;
      } else if (response && response.url) {
        imageUrl = response.url;
      } else {
        throw new Error("Không nhận được URL ảnh từ server");
      }

      setEditHeroUrl(imageUrl);
    } catch (error) {
      console.error("Lỗi khi tải lên hình ảnh hero banner:", error);
      toast.error("Tải lên hình ảnh hero banner thất bại");
    } finally {
      setIsUploadingEditHero(false);
    }
  };

  const addHeroBanner = async () => {
    if (!newHeroName || !newHeroUrl) {
      toast.error("Vui lòng nhập tên và tải lên hình ảnh");
      return;
    }

    try {
      await bannerService.addHeroBanner({
        name: newHeroName,
        url: newHeroUrl,
        isShow: newHeroVisible,
      });
      toast.success("Thêm hero banner thành công!");
      // Reset form
      setNewHeroName("");
      setNewHeroUrl("");
      setNewHeroVisible(true);
      fetchBanner();
    } catch (error) {
      console.error("Lỗi khi thêm hero banner:", error);
      toast.error("Thêm hero banner thất bại");
    }
  };

  const updateHeroBanner = async () => {
    if (!editingHero || !editHeroName || !editHeroUrl) {
      toast.error("Thông tin không hợp lệ");
      return;
    }

    try {
      await bannerService.updateHeroBanner(editingHero._id!, {
        name: editHeroName,
        url: editHeroUrl,
        isShow: editHeroVisible,
      });
      toast.success("Cập nhật hero banner thành công!");
      closeEditModal();
      fetchBanner();
    } catch (error) {
      console.error("Lỗi khi cập nhật hero banner:", error);
      toast.error("Cập nhật hero banner thất bại");
    }
  };

  const deleteHeroBanner = async (id: string) => {
    const performDelete = async () => {
      try {
        await bannerService.deleteHeroBanner(id);
        toast.success("Xóa hero banner thành công!");
        fetchBanner();
      } catch (error) {
        console.error("Lỗi khi xóa hero banner:", error);
        toast.error("Xóa hero banner thất bại");
      }
    };

    showConfirm(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa banner này? Hành động này không thể hoàn tác.",
      performDelete
    );
  };

  const toggleHeroBannerVisibility = async (id: string) => {
    try {
      await bannerService.toggleHeroBannerVisibility(id);
      toast.success("Đã thay đổi trạng thái hiển thị!");
      fetchBanner();
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái hiển thị:", error);
      toast.error("Thay đổi trạng thái hiển thị thất bại");
    }
  };

  const openEditModal = (hero: HeroItem) => {
    setEditingHero(hero);
    setEditHeroName(hero.name);
    setEditHeroUrl(hero.url);
    setEditHeroVisible(hero.isShow);
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setEditingHero(null);
    setEditHeroName("");
    setEditHeroUrl("");
    setEditHeroVisible(true);
  };

  // Hero Banner Item component
  const HeroBannerItem = ({ hero }: { hero: HeroItem }) => {
    return (
      <div className="flex items-center gap-4 border rounded-md p-3 mb-2 bg-white">
        <div className="relative h-16 w-24 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={hero.url}
            alt={hero.name}
            layout="fill"
            objectFit="cover"
            className="rounded-md"
            unoptimized
          />
        </div>
        <div className="flex-grow">
          <h3 className="font-medium">{hero.name}</h3>
          <p className="text-sm text-muted-foreground">
            {hero.isShow ? "Hiển thị" : "Ẩn"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => toggleHeroBannerVisibility(hero._id!)}
          >
            {hero.isShow ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => openEditModal(hero)}
          >
            <PencilLine size={16} />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => deleteHeroBanner(hero._id!)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <h1 className="text-2xl font-bold">Quản lý Banner</h1>

      {/* Header Banner Section */}
      <Card>
        <CardHeader>
          <CardTitle>Header Banner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {banner?.headerBanner ? (
            <div className="relative h-40 w-full rounded-md overflow-hidden border">
              <Image
                src={banner.headerBanner}
                alt="Header Banner"
                layout="fill"
                objectFit="cover"
                unoptimized
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 z-10"
                onClick={removeHeaderBanner}
              >
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div
              className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors"
              onClick={() => headerImageInputRef.current?.click()}
            >
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">
                    nhấp để tải lên
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF tối đa 10MB
                </p>
              </div>
            </div>
          )}
          <Input
            ref={headerImageInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                uploadHeaderBanner(e.target.files[0]);
              }
            }}
          />
          {isUploadingHeader && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
              <span className="text-muted-foreground">Đang tải lên...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hero Banner Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Hero Banner</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2"
            >
              {previewMode ? "Quản lý" : "Xem trước"}
              {previewMode ? <PencilLine size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {previewMode ? (
            // Preview Mode - Slider
            <div className="space-y-4">
              <div className="relative w-full h-[400px] rounded-md overflow-hidden border">
                {banner?.heroBanner && banner.heroBanner.length > 0 ? (
                  <Image
                    src={banner.heroBanner[activeHeroIndex]?.url || ""}
                    alt={banner.heroBanner[activeHeroIndex]?.name || ""}
                    layout="fill"
                    objectFit="cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100">
                    <p className="text-gray-500">Không có banner nào</p>
                  </div>
                )}
              </div>

              {banner?.heroBanner && banner.heroBanner.length > 1 && (
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setActiveHeroIndex((prev) =>
                        prev === 0 ? banner.heroBanner.length - 1 : prev - 1
                      )
                    }
                  >
                    <MoveUp className="rotate-90" size={16} />
                  </Button>
                  <div className="flex items-center">
                    {banner.heroBanner.map((_, idx) => (
                      <button
                        key={idx}
                        className={`w-3 h-3 mx-1 rounded-full ${
                          activeHeroIndex === idx ? "bg-primary" : "bg-gray-300"
                        }`}
                        onClick={() => setActiveHeroIndex(idx)}
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setActiveHeroIndex((prev) =>
                        prev === banner.heroBanner.length - 1 ? 0 : prev + 1
                      )
                    }
                  >
                    <MoveDown className="rotate-90" size={16} />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // Management Mode
            <div className="space-y-6">
              <div className="border rounded-md p-4 space-y-4">
                <h3 className="font-medium">Thêm Banner Mới</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="hero-name">Tên Banner</Label>
                    <Input
                      id="hero-name"
                      placeholder="Nhập tên banner"
                      value={newHeroName}
                      onChange={(e) => setNewHeroName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hình Ảnh</Label>
                    {newHeroUrl ? (
                      <div className="relative h-40 w-full rounded-md overflow-hidden border">
                        <Image
                          src={newHeroUrl}
                          alt="New Hero Banner"
                          layout="fill"
                          objectFit="cover"
                          unoptimized
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 z-10"
                          onClick={() => setNewHeroUrl("")}
                        >
                          <XCircle className="h-5 w-5" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors"
                        onClick={() => heroImageInputRef.current?.click()}
                      >
                        <div className="space-y-1 text-center">
                          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-primary">
                              nhấp để tải lên
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, GIF tối đa 10MB
                          </p>
                        </div>
                      </div>
                    )}
                    <Input
                      ref={heroImageInputRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          uploadHeroImage(e.target.files[0]);
                        }
                      }}
                    />
                    {isUploadingHero && (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
                        <span className="text-muted-foreground">
                          Đang tải lên...
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="visibility"
                      checked={newHeroVisible}
                      onCheckedChange={setNewHeroVisible}
                    />
                    <Label htmlFor="visibility">Hiển thị banner</Label>
                  </div>
                  <Button onClick={addHeroBanner} className="w-full">
                    <Plus size={16} className="mr-2" />
                    Thêm Banner
                  </Button>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-4">Danh sách Hero Banner</h3>
                {banner?.heroBanner && banner.heroBanner.length > 0 ? (
                  <ScrollArea className="h-[400px] pr-4">
                    {banner.heroBanner.map((hero) => (
                      <HeroBannerItem key={hero._id} hero={hero} />
                    ))}
                  </ScrollArea>
                ) : (
                  <div className="flex items-center justify-center h-40 border rounded-md">
                    <p className="text-muted-foreground">Chưa có banner nào</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Hero Banner Dialog */}
      <Dialog open={isEditing} onOpenChange={closeEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Hero Banner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên Banner</Label>
              <Input
                id="edit-name"
                value={editHeroName}
                onChange={(e) => setEditHeroName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Hình Ảnh</Label>
              {editHeroUrl && (
                <div className="relative h-40 w-full rounded-md overflow-hidden border">
                  <Image
                    src={editHeroUrl}
                    alt="Hero Banner"
                    layout="fill"
                    objectFit="cover"
                    unoptimized
                  />
                </div>
              )}
              <Button
                variant="outline"
                type="button"
                onClick={() => editHeroImageInputRef.current?.click()}
                className="w-full"
                disabled={isUploadingEditHero}
              >
                {isUploadingEditHero ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="mr-2 h-4 w-4" />
                )}
                {isUploadingEditHero ? "Đang tải lên..." : "Thay đổi ảnh"}
              </Button>
              <Input
                ref={editHeroImageInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    uploadEditHeroImage(e.target.files[0]);
                  }
                }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-visibility"
                checked={editHeroVisible}
                onCheckedChange={setEditHeroVisible}
              />
              <Label htmlFor="edit-visibility">Hiển thị banner</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditModal}>
              Hủy
            </Button>
            <Button onClick={updateHeroBanner}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={handleConfirmNo}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {confirmTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {confirmMessage}
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleConfirmNo}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmYes} autoFocus>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBannerPage;
