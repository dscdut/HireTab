import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Nguyen Van A',
    position: 'HR Manager',
    company: 'Tech Solutions',
    content:
      'HireTab has helped us reduce resume screening time by 70% and find high-quality candidates.',
    rating: 5
  },
  {
    name: 'Tran Thi B',
    position: 'Talent Acquisition',
    company: 'Digital Corp',
    content:
      'HireTab’s AI tool is highly intelligent, helping us find the most suitable candidates for the position.',
    rating: 5
  },
  {
    name: 'Le Van C',
    position: 'Recruitment Lead',
    company: 'Innovation Hub',
    content:
      'I’m very impressed with HireTab’s resume analysis and evaluation capabilities. It’s an excellent solution for businesses.',
    rating: 5
  }
]

const products = [
  {
    name: 'Unigo',
    description: 'Hệ thống mô phỏng bản đồ trường Đại Học Bách Khoa - Đại học Đà Nẵng',
    image: 'https://dut.gdsc.dev/static/media/uniGO.5edcd2ae7021100c7ee3.jpg',
  },
  {
    name: 'BeeBee Travel',
    description: 'Nền tảng (B2B) kết nối các doanh nghiệp cung cấp các dịch vụ du lịch',
    image: 'https://dut.gdsc.dev/static/media/BeeBeeTravel.65869692647602915857.png',
  },
  {
    name: 'Provo',
    description: 'Hệ sinh thái học tiếng Anh cung cấp các dịch vụ như: học từ vựng tiếng anh hay hỗ trợ sửa lỗi IELTS Writing,...',
    image: 'https://dut.gdsc.dev/static/media/PROVO.459c9036bf02b367496a.png',
  },
  {
    name: 'GDSC - DUT URL Shortener',
    description: 'Công cụ hỗ trợ rút gọn link được phát triển bởi GDSC - DUT',
    image: 'https://dut.gdsc.dev/static/media/url-shortener.f382a0e4bdc3c1c1efa7.png',
  },
  {
    name: 'Event Cookbook',
    description: 'Cẩm nang tổ chức sự kiện',
    image: 'https://dut.gdsc.dev/static/media/Event-Cookbook.5b78a2ac2c1656b62cda.png',
  },
  {
    name: 'Smartfood',
    description: 'Ứng dụng gợi ý công thức nấu ăn từ thực phẩm có sẵn',
    image: 'https://dut.gdsc.dev/static/media/SMARTFOOD.12662b2786ca3b7f1ecb.png',
  },
  {
    name: 'MyEvents',
    description: 'Ứng dụng quản lý tổ chức sự kiện',
    image: 'https://dut.gdsc.dev/static/media/MyEvents.f743adeafa65fdb29367.png',
  },
  {
    name: 'HappyChild',
    description: 'Nền tảng hỗ trợ phụ huynh xác định sớm, đánh giá và nuôi dạy trẻ tự kỷ',
    image: 'https://dut.gdsc.dev/static/media/HappyChild.33cab0594199f7f210ab.jpg',
  },
  {
    name: 'BloodBond',
    description: 'Nền tảng hỗ trợ công tác hiến máu',
    image: 'https://dut.gdsc.dev/static/media/BloodBond.3c2df1bc8339a066f9bd.jpg',
  },
  {
    name: 'SharingHub',
    description: 'Ứng dụng hỗ trợ hoạt động thiện nguyện',
    image: 'https://dut.gdsc.dev/static/media/url-shortener.f382a0e4bdc3c1c1efa7.png',
  },
]

const ProductShowcase = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-6xl font-bold text-gray-900">Product Showcase</h2>
          <p className="text-3xl text-gray-600">
            Một số sản phẩm nổi bật mà tụi mình đã thực hiện
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: false }}
              className="group p-7 rounded-2xl bg-gray-50 hover:bg-white shadow-md hover:shadow-2xl border border-gray-200 hover:border-blue-500 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
              whileHover={{ y: -10, scale: 1.04 }}
            >
              <div className="w-28 h-28 mb-5 rounded-xl bg-gray-200 flex items-center justify-center overflow-hidden">
                <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">{product.name}</h3>
              <p className="text-gray-700 text-base font-medium">{product.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductShowcase