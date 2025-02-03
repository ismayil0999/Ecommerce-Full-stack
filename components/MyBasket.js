import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector, useDispatch } from "react-redux";
import { openBasket } from "@/redux/slice";
import Link from "next/link";
import { totalPrice,getCartProducts,removeProduct } from "@/functions/basketfunctions";
import { motion } from "framer-motion";
export default function MyBasket() {
    const [cartsProducts, setCartsProducts] = useState([]);
    const [loading,setLoading]=useState(true)
    const { data: session } = useSession();
    const { basket } = useSelector((state) => state.categories);
    const [total,setTotal]=useState(0)
    const dispatch=useDispatch()
    const userId = session?.user?.id;

    useEffect(() => {
    getCartProducts(userId,setCartsProducts,setLoading);
    console.log(cartsProducts)
    }, [session]);

    useEffect(() => {
      totalPrice(cartsProducts,setTotal);
    }, [cartsProducts]);


    return (
      <motion.div  initial={{ x: 300, opacity: 0 }}
      animate={{ x: basket ? 0 : 300, opacity: basket ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}  className={`overflow-hidden w-full h-[100vh] flex justify-end  fixed top-0 right-0 z-[999] bg-[#0a0a0a51]`}>
         <div className={`relative pb-[70px] w-full flex flex-col justify-start sm:w-[50%] md:w-[35%] lg:w-[30%] bg-white h-[100vh]`}>
        <div className="flex items-center h-[50px] p-[20px] justify-between w-full bg-white border-b-[2px] border-[#F6F7FA]">
            <h1 className="text-[#8A2BE2] font-bold text-[18px]">My basket</h1>
            <span className="flex items-center justify-center w-[30px] h-[30px] bg-[#8A2BE2] rounded-full ">
            <CloseIcon onClick={()=>{dispatch(openBasket())}} className="text-white"/>
            </span>
        </div>
        <div className="flex flex-col  items-center gap-[5px] w-full overflow-scroll">
        {loading ? (
    <div className="flex flex-col items-center gap-[10px] pt-[60px]">
        <CircularProgress fontSize="large"/>
      <p className="text-black">Loading...</p>
    </div>
  ) : 
  !session ? (
    <div className="flex flex-col items-center gap-[10px] pt-[60px]">
      <p className="text-black">Login to add products to the basket</p>
      <Link href="./user/login" className="font-bold text-[#8A2BE2]">
        Click here
      </Link>
    </div>
  ) : 
  cartsProducts?.length<=0 ? (
    <div className="flex flex-col items-center gap-[10px] pt-[60px]">
      <p className="text-black">Basket is empty</p>
    </div>
  ) : 
  cartsProducts?.map((product, index) => (
    <div key={index} className="flex justify-between h-auto w-full bg-white rounded-[5px] p-[15px] border-b-[2px] border-[#F6F7FA]">
      <div className="flex items-center justify-center h-full w-[60px]">
        <img src={product.file} alt={product.name} />
      </div>
      <div className="flex flex-col gap-[3px] items-start w-[60%]">
        <h1 className="text-black font-bold truncate">{product.name}</h1>
        <p className="text-black">{product.price}</p>
        <p className="text-black">{product.quantity}</p>
      </div>
      <div className="flex items-center justify-center">
        <CloseIcon onClick={() => { removeProduct(product.productId, userId, setCartsProducts); }} className="text-black" />
      </div>
    </div>
  ))}
 
<div className="w-full absolute bottom-0 left-0 bg-white h-auto flex items-center justify-center p-[10px]">
<div className="h-[50px] hover:bg-[#6412b1]  flex justify-between items-center p-[10px] w-full bg-[#8A2BE2] rounded-[30px]">
    <h1 className="text-white font-bold pl-[10px]">Checkout</h1>
    <span className="flex items-center justify-center w-auto min-w-[70px] rounded-[20px] p-[5px] bg-white text-black font-bold">
       {total + " $"}
    </span>
</div>
</div>
        </div>

       </div>
      </motion.div>
    );
}
