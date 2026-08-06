import { Link } from "@tanstack/solid-router";
import BellIcon from "lucide-solid/icons/bell";
import type { ParentComponent } from "solid-js";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Header: ParentComponent = (props) => {
	return (
		<header class="flex justify-between px-8 py-4">
			{props.children}
			<div class="flex space-x-2">
				<Button variant="ghost" size="icon" class="size-8">
					<BellIcon size={16} />
				</Button>
				<Link to="/user/profile">
					<Avatar class="size-8">
						<AvatarImage src="https://github.com/tejasahluwalia.png" />
						<AvatarFallback>TA</AvatarFallback>
					</Avatar>
				</Link>
			</div>
		</header>
	);
};

export default Header;
