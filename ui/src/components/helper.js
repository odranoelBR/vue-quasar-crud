export function formatForPostValidator (columns) {
	return columns.some(column => {
		if (column.formatForPost && typeof column.formatForPost !== 'function') {
			console.warn(`formatForPost must be function on column ${column.name}`)
			return false
		}
		return true
	})
}