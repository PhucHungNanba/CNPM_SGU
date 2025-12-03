import Product from '../models/productModel.js';
import Inventory from '../models/inventoryModel.js'; // Nhớ tạo file này ở bước trước

// @desc    Tạo một sản phẩm mới (Master Data)
// @route   POST /
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl, category } = req.body;
        const product = new Product({
            name,
            description,
            price,
            imageUrl,
            category,
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Lấy tất cả sản phẩm (Hỗ trợ lọc theo Branch)
// @route   GET /?branchId=...&keyword=...
export const getAllProducts = async (req, res) => {
    try {
        const { branchId, keyword } = req.query;

        // 1. Query tìm kiếm theo tên (nếu có)
        let productQuery = {};
        if (keyword) {
            productQuery.name = {
                $regex: keyword,
                $options: 'i', // Không phân biệt hoa thường
            };
        }

        // 2. Trường hợp KHÔNG chọn chi nhánh (Admin xem hoặc chưa chọn)
        if (!branchId) {
            // Trả về list master products
            const products = await Product.find(productQuery);
            return res.json(products);
        }

        // 3. Trường hợp CÓ chọn chi nhánh -> Tìm trong Inventory
        // Lấy danh sách các món CÒN HÀNG tại chi nhánh đó
        const inventories = await Inventory.find({
            branchId: branchId,
            countInStock: { $gt: 0 }, // Chỉ lấy món còn hàng > 0
            isAvailable: true
        });

        // Nếu kho rỗng
        if (!inventories || inventories.length === 0) {
            return res.json([]);
        }

        // Lấy danh sách ID sản phẩm từ Inventory
        const productIds = inventories.map(item => item.product);

        // Tìm chi tiết sản phẩm dựa trên list ID đó (kết hợp keyword search)
        productQuery._id = { $in: productIds };
        let products = await Product.find(productQuery);

        // Gán lại countInStock từ Inventory vào kết quả trả về
        // Để frontend biết số lượng tồn kho thực tế tại chi nhánh đó
        const result = products.map(product => {
            const inv = inventories.find(i => i.product.toString() === product._id.toString());
            return {
                ...product.toObject(), // Chuyển Mongoose Document sang Object thường
                countInStock: inv ? inv.countInStock : 0
            };
        });

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Lấy một sản phẩm theo ID (Kèm tồn kho chi nhánh nếu có)
// @route   GET /:id?branchId=...
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            const { branchId } = req.query;
            let productData = product.toObject();

            // Nếu có branchId, tìm tồn kho cụ thể của chi nhánh đó
            if (branchId) {
                const inventory = await Inventory.findOne({
                    product: req.params.id,
                    branchId: branchId
                });
                // Ghi đè countInStock bằng số lượng thực tế ở chi nhánh
                productData.countInStock = inventory ? inventory.countInStock : 0;
            }

            res.json(productData);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Cập nhật một sản phẩm
// @route   PUT /:id
export const updateProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl, category } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.imageUrl = imageUrl || product.imageUrl;
            product.category = category || product.category;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật sản phẩm', error: error.message });
    }
};

// @desc    Xóa một sản phẩm (Và xóa luôn trong kho các chi nhánh)
// @route   DELETE /:id
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // 1. Xóa sản phẩm gốc
            await product.deleteOne();

            // 2. Xóa tất cả inventory liên quan đến sản phẩm này (Clean up)
            await Inventory.deleteMany({ product: req.params.id });

            res.json({ message: 'Sản phẩm và dữ liệu kho liên quan đã được xóa' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa sản phẩm', error: error.message });
    }
};

// @desc    (DEV ONLY) Tạo dữ liệu kho giả lập cho 1 chi nhánh
// @route   POST /seed-inventory
export const seedInventory = async (req, res) => {
    const { branchId, stock } = req.body;

    if (!branchId) return res.status(400).json({ message: 'Cần branchId' });

    try {
        const products = await Product.find({});

        // Xóa inventory cũ của chi nhánh này
        await Inventory.deleteMany({ branchId });

        const inventoryItems = products.map(product => ({
            product: product._id,
            branchId: branchId,
            countInStock: stock || 50, // Mặc định 50 cái mỗi món
            isAvailable: true
        }));

        await Inventory.insertMany(inventoryItems);

        res.json({ message: `Đã nhập kho thành công ${products.length} món cho chi nhánh ${branchId}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};