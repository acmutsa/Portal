import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";

const DataTableDemo = () => {
	const [products, setProducts] = useState([]);

	useEffect(() => {}, []);

	return (
		<DataTable value={products}>
			<Column field="code" header="Code"></Column>
			<Column field="name" header="Name"></Column>
			<Column field="category" header="Category"></Column>
			<Column field="quantity" header="Quantity"></Column>
		</DataTable>
	);
};

export default DataTableDemo;
