export function validate(schema) {
  return (req, res, next) => {
    for (const key in schema) {
      const rules = schema[key].split("|");
      const value = req.body[key];

      if (rules.includes("required") && (value === undefined || value === "")) {
        return res.status(400).json({
          error: `${key} is required`,
        });
      }

      if (rules.includes("email")) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return res.status(400).json({
            error: `${key} must be a valid email`,
          });
        }
      }

      if (rules.includes("string") && typeof value !== "string") {
        return res.status(400).json({
          error: `${key} must be a string`,
        });
      }
    }

    next();
  };
}
