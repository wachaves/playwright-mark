import { expect, test } from '@playwright/test'
// import { faker } from '@faker-js/faker'

import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks'

import data from './fixtures/tasks.json'

let tasksPage: TasksPage

test.beforeEach(({ page }) => {
    tasksPage = new TasksPage(page)
})

test.describe('cadastro', () => {
    test('Deve poder cadastrar uma nova tarefa', async ({ request }) => {
        const task = data.success as TaskModel

        //const taskName = 'Ler um livro de Typescript' -- retirado devido a task: TaskModel ter sido implantada

        await deleteTaskByHelper(request, task.name)

        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.shouldHaveText(task.name)


        // const target = page.locator('css=.task-item p >> text=' + taskName) -- igual a de cima mas com escrita de concatenação diferente
        // const target = page.locator('div[class*=listItem]') -- quando tem dois elementos com mesmo nome dá erro no teste
        // const target = page.locator('.task-item')
        // const target = page.getByTestId('task-item')

        // await expect(target).toHaveText(taskName) -- usar este com os que estão comentados





        // const inputTaskName = page.locator('input[class*=InputNewTask]')
        // await inputTaskName.fill(taskName) 

        // await inputTaskName.fill(faker.lorem.words()) -- faker
        // await inputTaskName.fill(faker.lorem.paragraph()) -- faker


        // selector do playwright
        // await page.click('css=button >> text=Create')

        // await page.click('xpath=//button[contains(text(), "Create")]') -- xpath

        // await inputTaskName.press('Enter')

        // await page.fill('input[class*=InputNewTask]', 'Ler um livro de TypeScript') - Outro modo de preenchimento
    })

    test('não deve permitir tarefa duplicada', async ({ request }) => {
        const task = data.duplicate as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.alertHaveText('Task already exists!')
    })

    test('campo obrigatório', async () => {
        const task = data.required as TaskModel

        await tasksPage.go()
        await tasksPage.create(task)

        const validationMessage = await tasksPage.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
        expect(validationMessage).toEqual('This is a required field')
    })
})

test.describe('atualização', () => {
    test('deve concluir uma terefa', async ({ request }) => {
        const task = data.update as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        await tasksPage.go()
        await tasksPage.toggle(task.name)
        await tasksPage.shouldBeDone(task.name)
    })
})

test.describe('exclusão', () => {
    test('deve excluir uma terefa', async ({ request }) => {
        const task = data.delete as TaskModel

        await deleteTaskByHelper(request, task.name)
        await postTask(request, task)

        await tasksPage.go()
        await tasksPage.remove(task.name)
        await tasksPage.shouldNotExist(task.name)
    })
})