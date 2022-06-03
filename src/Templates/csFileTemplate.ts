export function csFileTemplate(filename: string, namespace: string): string {
	return `using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ${namespace};

public class ${filename.replace(".cs", "")}
{
}
`;
}

