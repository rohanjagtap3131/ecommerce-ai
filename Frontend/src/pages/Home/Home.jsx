import { useEffect, useState } from "react";
import BannerProduct from "../../Components/bannerProduct/BannerProduct";
import CategoryList from "../../Components/CategoryList/CategoryList";
import HorizentelCardProduct from "../../Components/HorizentelCardProduct/HorizentelCardProduct";
import AiChatBot from "../../Components/AiChatBot/AiChatBot";

export default function Home() {

  // ✅ Reload once
  useEffect(() => {
    if (!sessionStorage.getItem("reloaded")) {
      sessionStorage.setItem("reloaded", "true");
      window.location.reload();
    }
  }, []);

  
  
  return (
    <div>
      {/* Home Content */}
      <CategoryList />
      <BannerProduct />
      <HorizentelCardProduct category={"airpodes"} heading={"Top's Airpodes"} />
      <HorizentelCardProduct category={"earphones"} heading={"Popular Earphones"} />
      <HorizentelCardProduct category={"mobile"} heading={"Best Smart Phone's"} />
      <HorizentelCardProduct category={"speakers"} heading={"Top's Speakers"} />
      <HorizentelCardProduct category={"watches"} heading={"Popular Watches"} />
      <HorizentelCardProduct category={"mouse"} heading={"Best Mouse's"} />
      <HorizentelCardProduct category={"printers"} heading={"Top's Printers"} />
      <HorizentelCardProduct category={"refrigerator"} heading={"Top's Refrigerator"} />
      <HorizentelCardProduct category={"televisitions"} heading={"Best Televisitions"} />
      <HorizentelCardProduct category={"processor"} heading={"Top's Processor"} />
      <HorizentelCardProduct category={"trimmers"} heading={"Best Trimmers"} />
      <HorizentelCardProduct category={"camera"} heading={"Top's Camera"} />

      <AiChatBot/>

    </div>
  );
}
