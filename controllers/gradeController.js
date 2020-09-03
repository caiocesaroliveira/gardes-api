import { db } from "../models/index.js"
import { logger } from "../config/logger.js"
import Grade from "../models/Grade.js"

const create = async (req, res) => {
  const { name, subject, type, value } = req.body

  try {
    const findGrade = await Grade.findOne({ name, subject, type })

    if (findGrade) {
      return res.status(500).json({ erro: "Registro existente" })
    }

    await Grade.create({
      name,
      subject,
      type,
      value,
      lastModified: new Date(), //new Date("1995-12-17T03:24:00")
    })

    res.send({ message: "Grade inserido com sucesso" })
    logger.info(`POST /grade - ${JSON.stringify()}`)
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Algum erro ocorreu ao salvar" })
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`)
  }
}

const findAll = async (req, res) => {
  const name = req.query.name

  //condicao para o filtro no findAll
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {}

  try {
    const findGrade = await Grade.find().sort({ name: 1 })

    return res.status(200).json(findGrade)

    logger.info(`GET /grade`)
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || "Erro ao listar todos os documentos" })
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`)
  }
}

const findOne = async (req, res) => {
  const { id } = req.params

  try {
    const findGrade = await Grade.findById({ _id: id })

    if (!findGrade) {
      return res.status(400).json({ erro: "Grade não encontrada" })
    }

    return res.status(200).json(findGrade)
    logger.info(`GET /grade - ${id}`)
  } catch (error) {
    res.status(500).send({ message: "Erro ao buscar o Grade id: " + id })
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`)
  }
}

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Dados para atualizacao vazio",
    })
  }

  const { id } = req.params
  const { name, subject, type, value } = req.body

  try {
    const findGrade = await Grade.findOneAndUpdate(
      { _id: id },
      { name, subject, type, value, lastModified: new Date() },
      {
        new: true,
      }
    )

    if (!findGrade) {
      return res
        .status(400)
        .json({ erro: "Registro não encontrado para atualizar" })
      logger.info(`PUT /grade - ${id}`)
    }

    return res.status(200).json(findGrade)
    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`)
  } catch (error) {
    res.status(500).send({ message: "Erro ao atualizar a Grade id: " + id })
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`)
  }
}

const remove = async (req, res) => {
  const { id } = req.params

  try {
    await Grade.deleteOne({ _id: id })
    return res.json({ message: `Grade ${id} excluída` })
    logger.info(`DELETE /grade - ${id}`)
  } catch (error) {
    res
      .status(500)
      .send({ message: "Nao foi possivel deletar o Grade id: " + id })
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`)
  }
}

const removeAll = async (req, res) => {
  try {
    await Grade.remove()
    return res.json({ message: `Todas as grades foram excluída` })
    logger.info(`DELETE /grade`)
  } catch (error) {
    res.status(500).send({ message: "Erro ao excluir todos as Grades" })
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`)
  }
}

export default { create, findAll, findOne, update, remove, removeAll }
