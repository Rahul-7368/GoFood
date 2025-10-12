import React from 'react';
import trash from '../images/trash.png';
import { useCart, useDispatchCart } from '../components/ContextReducer';

const Cart = () => {
    let data = useCart();
    let dispatch = useDispatchCart();

    if (data.length === 0) {
        return (
            <div>
                <div className='m-5 w-100 text-center fs-3 text-warning'>
                    The Cart is Empty!
                </div>
            </div>
        );
    }

    const handleCheckout = async () => {
        let userEmail = localStorage.getItem("userEmail");
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/orderData`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                order_data: data,
                email: userEmail,
                order_date: new Date().toDateString()
            })
        });
        console.log("Order Response", response)
        if (response.status === 200) {
            dispatch({ type: "DROP" })
        }
    }

    let totalPrice = data.reduce((total, food) => total + food.price, 0);

    return (
        <div>
            <div className='container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md'>
                <table className='table table-hover'>
                    <thead className='text-success fs-4'>
                        <tr>
                            <th scope='col' className='text-success'>#</th>
                            <th scope='col' className='text-success'>Name</th>
                            <th scope='col' className='text-success'>Quantity</th>
                            <th scope='col' className='text-success'>Option</th>
                            <th scope='col' className='text-success'>Amount</th>
                            <th scope='col' className='text-success'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((food, index) => (
                            <tr key={index}>
                                <th scope='row'>{index + 1}</th>
                                <td>{food.name}</td>
                                <td>{food.qty}</td>
                                <td>{food.size}</td>
                                <td>{food.price}</td>
                                <td>
                                    <button
                                        type='button'
                                        className='btn p-0'
                                        onClick={() =>
                                            dispatch({ type: 'REMOVE', index: index })
                                        }
                                    >
                                        <img
                                            src={trash}
                                            alt='delete'
                                            style={{ width: '20px', height: '20px' }}
                                        />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div>
                    <h1 className='fs-2 text-success'>Total Price: ₹{totalPrice}</h1>
                </div>
                <div>
                    <button className='btn bg-success mt-5 text-white' onClick={handleCheckout}>Check Out</button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
