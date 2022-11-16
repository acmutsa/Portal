import React from "react";
import { BsFillTrashFill, BsPencilFill } from "react-icons/bs";

interface RowActionsProp {
	onEdit?: React.MouseEventHandler<HTMLButtonElement>;
	onDelete?: React.MouseEventHandler<HTMLButtonElement>;
}

export const RowActions = ({ onEdit, onDelete }: RowActionsProp) => {
	return (
		<div className="text-base [&>*]:p-2 [&>*]:mx-1 [&>*]:rounded">
			{onEdit != null ? (
				<button onClick={onEdit} className="bg-sky-600 hover:bg-sky-700 text-white">
					<BsPencilFill />
				</button>
			) : null}
			{onDelete != null ? (
				<button onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white">
					<BsFillTrashFill />
				</button>
			) : null}
		</div>
	);
};
