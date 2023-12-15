import HeaderDefaultLayout from "./HeaderDefaultLayout.jsx";
import FooterDefaultLayout from "./FooterDefaultLayout.jsx";

export  default function FrameLayout(BodyLayout){
    return (
        <>
            <HeaderDefaultLayout/>
            {BodyLayout}
            <FooterDefaultLayout/>
        </>
    )
}