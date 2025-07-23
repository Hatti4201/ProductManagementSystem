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
    const isEdit = Boolean(id) // 判断url中是否有id，以此来确认是否在编辑状态

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
            console.log('正在请求商品数据， id=',id);
            fetchProductById(id).then((data) => {
                console.log('数据获取成功:',data);
                setForm({
                    name: data.name,
                    description: data.description,
                    price: data.price?.toString(),
                    category: data.category,
                    stock: data.stock?.toString(),
                    imageUrl: data.imageUrl,
                });
            });
        }
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const data = {
            ...form,
            price: Number(form.price),
            stock: Number(form.stock), //将表格内容转为合适的格式
        };

        try {
            if(isEdit) {
                await updateProduct(id, data);
            } else {
                await createProduct(data)
            }
            alert('Product saved!');
            navigate('/products');
        } catch(err) {
            alert(err.response?.data?.message || 'Failed to save');
        }
    };

    return (
        <div style= {{ maxWidth:'500px', margin:'auto' }}>
            <h2>{isEdit?'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    name='name'
                    placeholder='Product name'
                    value={form.name}
                    onChange={handleChange}
                    required 
                />
                <input 
                    type="text"
                    name='description'
                    placeholder='Product description'
                    value={form.description}
                    onChange={handleChange}
                />
                <input 
                    type="number"
                    name='price'
                    placeholder='Price'
                    value={form.price}
                    onChange={handleChange}
                    required
                />
                <input 
                    type="text"
                    name='category'
                    placeholder='Category'
                    value={form.category}
                    onChange={handleChange}
                />
                <input 
                    type="number"
                    name='stock'
                    placeholder='Stock'
                    value={form.stock}
                    onChange={handleChange}
                />
                <input 
                    type="text"
                    name='imageUrl'
                    placeholder='imageUrl'
                    value={form.imageUrl}
                    onChange={handleChange}
                />
                <button type='submit' style={{ marginTop: '10px' }}>
                    {isEdit?'Update' : 'Create'}
                </button>
            </form>
        </div>
    );
}