import ZeroToOne from "../models/ZeroToOne.js"

export const getUserQueries = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const user = req.user.id

    console.log(user)

    const queries = await ZeroToOne.find({ user }).sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      data: queries,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching queries",
      error: error.message,
    })
  }
}
