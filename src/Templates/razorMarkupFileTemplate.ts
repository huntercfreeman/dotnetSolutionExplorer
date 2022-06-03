export function razorMarkupFileTemplate(filename: string): string {
	return `<h3>${filename.replace(".razor", "")}</h3>

@code {
	
}
`;
}
