import TypewriteModule from "@/pages/home/TypewriteModule";


export default function Home() {
    return (
        <div
            style={{
                height: "70vh"
            }}
            className="flex flex-col items-center justify-center w-full">
            {/*<p className={"text-lg"}>Welcome to Type Sensei :)</p>*/}
            <TypewriteModule/>
        </div>
    );
}
