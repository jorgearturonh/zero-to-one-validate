import ZeroToOne from "../models/Search.js"

export const getUserQuery = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const user = req.user.id
    const { id } = req.params
    const query = await ZeroToOne.findOne({ user, _id: id })

    return res.status(200).json({
      success: true,
      data: query,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching queries",
      error: error.message,
    })
  }
}
