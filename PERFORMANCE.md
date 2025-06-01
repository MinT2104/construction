# Tối ưu hiệu suất Navigation cho dự án Next.js

Tài liệu này chứa các hướng dẫn và giải pháp để tối ưu hiệu suất navigation trong dự án Next.js.

## Các vấn đề đã được tối ưu

1. **Bundle size lớn**

   - Đã cấu hình `@next/bundle-analyzer` để phân tích bundle
   - Sử dụng dynamic import với `next/dynamic` để lazy load các component không cần thiết ngay lập tức
   - Thêm script `analyze` để kiểm tra bundle size: `npm run analyze`

2. **Dữ liệu fetch chậm**

   - Thêm caching layer trong các service API
   - Sử dụng kỹ thuật stale-while-revalidate
   - Invalidate cache một cách thông minh khi có thay đổi dữ liệu

3. **Link không được prefetch**

   - Tối ưu component Link với thuộc tính prefetch
   - Ưu tiên prefetch cho các link quan trọng
   - Cấu hình prefetch=true cho các link chính, prefetch=false cho các link ít sử dụng

4. **Rerender không cần thiết**

   - Sử dụng memo để tránh re-render các component không thay đổi
   - Tối ưu useEffect để tránh các side-effect không cần thiết
   - Sử dụng useCallback để tránh tạo lại hàm

5. **Layout render lại toàn bộ khi chuyển trang**

   - Tối ưu PageTransitionProvider để giữ các phần của layout
   - Giảm render không cần thiết bằng cách tách component

6. **Ảnh nặng**

   - Tối ưu Image component của Next.js
   - Thêm thuộc tính priority cho ảnh trên fold
   - Sử dụng lazy loading cho các ảnh ở dưới fold

7. **SSR response chậm**

   - Thêm cache control headers trong middleware
   - Tối ưu fetch data với cache và stale-while-revalidate

8. **Khác**
   - Tối ưu font loading
   - Cấu hình middleware để cache hiệu quả
   - Thêm hướng dẫn sử dụng mode production

## Cách sử dụng các tính năng tối ưu

### Phân tích bundle size

```bash
npm run analyze
```

### Build và chạy ở chế độ production

```bash
npm run build && npm start
# hoặc
npm run prod
```

### Kiểm tra hiệu suất

1. Sử dụng Chrome DevTools, tab Performance
2. Lighthouse để kiểm tra Core Web Vitals
3. Sử dụng [PageSpeed Insights](https://pagespeed.web.dev/)

## Các lưu ý quan trọng

- Luôn test trong môi trường production để có đánh giá chính xác
- Sử dụng `next/image` thay vì `<img>` để tận dụng tối ưu hóa hình ảnh
- Sử dụng `next/link` với prefetch khi cần
- Kiểm tra và tối ưu bundle size thường xuyên

## Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [React Optimization](https://reactjs.org/docs/optimizing-performance.html)
- [Web Vitals](https://web.dev/vitals/)
