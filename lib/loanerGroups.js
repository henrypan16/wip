// Lookups over LoanerGroups links (see getLoanerGroupLinks): a main item and its
// accessories are lent out together.

/**
 * @param {import('./types').LoanerGroupLink[]} links
 * @returns {{ accessoriesOf: Map<number, number[]>, mainOf: Map<number, number> }}
 */
export function loanerGroups(links) {
    const accessoriesOf = new Map();
    const mainOf = new Map();
    for (const { main_id, accessory_id } of links) {
        accessoriesOf.set(main_id, [...(accessoriesOf.get(main_id) ?? []), accessory_id]);
        mainOf.set(accessory_id, main_id);
    }
    return { accessoriesOf, mainOf };
}
