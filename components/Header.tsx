import Link from "next/link";

function Header() {
    return (
        <header className="flex justify-between p-5 max-w-7xl mx-auto"> 
        {/* 
        max-w-7xl mx-auto >>> no matter what page size we have set width,
        and to center that we use >>> mx-auto
        */}
            <div className="flex items-center space-x-5">
                {/* if the page which is already linked to using Link will pre-fetch already; so when the use click on the link to visit it is already fetched so quick result */}
                <Link href={'/'}>
                    <img className="w-44 object-contain cursor-pointer" src="https://links.papareact.com/yvf" alt="" />
                </Link>
                <div className="hidden md:inline-flex space-x-5 items-center">
                    <h3>About</h3>
                    <h3>Contact</h3>
                    <h3 className="text-white bg-green-600 rounded-full px-4 py-1">Follow</h3>
                </div>
            </div>

            <div className="flex items-center space-x-5 text-green-600">
                <h3>Sign In</h3>
                <h3 className="border px-4 py-1 rounded-full border-green-600">Get Started</h3>
            </div>
        </header>
    );
}

export default Header;
