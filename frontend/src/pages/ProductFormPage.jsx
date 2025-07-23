import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    createProduct,
    updateProduct,
    fetchProductById,
} from '../api/product';

export default function ProductFormPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        imageUrl: '',
    });

    useEffect(() => {
        if (isEdit) {
            console.log('正在请求商品数据，id =', id);
            fetchProductById(id).then((data) => {
                console.log('数据获取成功:', data);
                setForm({
                    name: data.name,
                    description: data.description,
                    price: data.price?.toString() || '',
                    category: data.category,
                    stock: data.stock?.toString() || '',
                    imageUrl: data.imageUrl,
                });
            });
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
        };

        try {
            if (isEdit) {
                await updateProduct(id, data);
            } else {
                await createProduct(data);
            }
            alert('Product saved!');
            navigate('/products');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: 'auto' }}>
            <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block font-medium mb-1">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Product name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>

                <div className="gap-ld" />

                <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        placeholder="Product description"
                        value={form.description}
                        onChange={handleChange}
                        rows={5}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>

                <div className="gap-ld" />

                <div>
                    <label className="block font-medium mb-1">Price ($)</label>
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={form.price}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Category</label>
                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Stock</label>
                    <input
                        type="number"
                        name="stock"
                        placeholder="Stock"
                        value={form.stock}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Image URL</label>
                    <input
                        type="text"
                        name="imageUrl"
                        placeholder="Image URL"
                        value={form.imageUrl}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>

                <button type="submit" style={{ marginTop: '10px' }}>
                    {isEdit ? 'Update' : 'Create'}
                </button>
            </form>
        </div>
    );
}
