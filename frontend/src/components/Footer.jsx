export default function Footer() {
  return (
    <footer className="bg-[#3F51B5] text-[#FFF8E1] text-sm py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-y-4">

        {/* 链接区域 */}
        <div className="flex flex-wrap justify-center sm:justify-start gap-4">
          <span className="cursor-pointer hover:underline">YouTube</span>
          <span className="cursor-pointer hover:underline">Facebook</span>
          <span className="cursor-pointer hover:underline">X</span>
          <span className="cursor-pointer hover:underline">Contact Us</span>
          <span className="cursor-pointer hover:underline">Privacy Policy</span>
          <span className="cursor-pointer hover:underline">Help</span>
        </div>

        {/* 版权区域 */}
        <div className="text-center sm:text-right text-[#F3E5F5] text-xs">
          © 2025 All rights reserved.
        </div>
      </div>
    </footer>
  );
}
