def normalize_strftime(strftime):
	"""
	Normalize strftime values to make sure their usable for datetime libraries.
	"""
	if not isinstance(strftime, str):
		# Convert non-str values to str to support stuff like "lazy_translations".
		strftime = str(strftime)
	return strftime
