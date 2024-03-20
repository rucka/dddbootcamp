import express, { Request, Response } from 'express'
import { Versioned } from '../datalayer/contract'

type GetAll<T> = () => Promise<Versioned<T>[]>
type GetById<T> = (id: string) => Promise<Versioned<T> | undefined>
type Insert<T> = (t: T) => Promise<void>
type Update<T> = (t: T, version: number) => Promise<void>
type Delete = (t: string, version: number) => Promise<void>

export const createRouter = <T>(
  idName: string,
  getAll: GetAll<T>,
  GetById: GetById<T>,
  insert: Insert<T>,
  update: Update<T>,
  remove: Delete,
) => {
  const router = express.Router()

  router.get('/', async (_: Request, res: Response) => {
    return res.json(await getAll())
  })

  router.post('/', async (req: Request, res: Response) => {
    if (!req.body) {
      res.status(400).json({ message: 'Invalid request' })
    }
    const entity = req.body as T
    try {
      await insert(entity)
      res.status(201).json(entity)
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  })

  router.put('/:version', async (req: Request, res: Response) => {
    if (!req.body) {
      res.status(400).json({ message: 'Invalid request' })
    }
    const entity = req.body as T
    if (!req.params['version']) {
      return res.status(400).send('Invalid request')
    }
    const version = parseInt(req.params['version'])

    try {
      await update(entity, version)
      res.status(201).json(entity)
    } catch (err: any) {
      res.status(400).json({ message: err.message })
    }
  })

  router.get(`/:${idName}`, async (req: Request, res: Response) => {
    if (!req.params[idName]) {
      return res.status(404).send('Not found')
    }
    const r = await GetById(req.params[idName])
    if (!r) {
      return res.status(404).send('Not found')
    }
    return res.json(r)
  })

  router.delete(`/:${idName}:version`, async (req: Request, res: Response) => {
    const id = req.params[idName]
    if (!id) {
      return res.status(404).send('Not found')
    }
    if (!req.params['version']) {
      return res.status(400).send('Invalid request')
    }
    const version = parseInt(req.params['version'])
    return res.json(await remove(id, version))
  })
  return router
}
