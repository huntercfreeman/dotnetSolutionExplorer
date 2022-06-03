export function razorCodebehindFileTemplate(filename: string, namespace: string): string {
	return `using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Components;

namespace ${namespace};

public partial class ${filename.replace(".razor.cs", "")} : ComponentBase
{
}
`;
}