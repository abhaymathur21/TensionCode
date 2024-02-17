'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { SelectGroup, SelectLabel } from '@radix-ui/react-select';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const FormSchema = z.object({
    language: z.string({
        required_error: 'please select a language',
    }),
    task: z.string({
        required_error: 'please enter a task',
    }),
    input_format: z.string({
        required_error: 'please select an input format',
    }),
    output_format: z.string({
        required_error: 'please select an output format',
    }),
    db_provider: z.string({
        required_error: 'please select a database provider',
    }),
    db_schema: z.string({
        required_error: 'please enter a database schema',
    }),
});

const SelectForm = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast(
            <>
                <h2 className='text-lg font-semibold'>
                    Form submitted successfully
                </h2>
                <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
                    <code className='text-white'>
                        {JSON.stringify(data, null, 2)}
                    </code>
                </pre>
            </>
        );

        console.log(JSON.stringify(data, null, 2));
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='grid grid-cols-2 gap-4'>
                <FormField
                    control={form.control}
                    name='task'
                    render={({ field }) => (
                        <FormItem className='col-span-2'>
                            <div className='flex gap-2 items-center'>
                                <FormLabel>Task:</FormLabel>
                                <FormDescription>
                                    The task you want to generate the the code
                                    for.
                                </FormDescription>
                            </div>
                            <Input type='text' placeholder='Task' {...field} />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='language'
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex gap-2 items-center'>
                                <FormLabel>Language:</FormLabel>
                                <FormDescription>
                                    The language you are using for development.
                                </FormDescription>
                            </div>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Language' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value='python'>
                                        Python
                                    </SelectItem>
                                    <SelectItem value='javascript'>
                                        JavaScript
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='db_provider'
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex gap-2 items-center'>
                                <FormLabel>Database:</FormLabel>
                                <FormDescription>
                                    The database provider you are using.
                                </FormDescription>
                            </div>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Database' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>SQL</SelectLabel>
                                        <SelectItem value='mysql'>
                                            MySQL
                                        </SelectItem>
                                        <SelectItem value='postgresql'>
                                            PostgreSQL
                                        </SelectItem>
                                    </SelectGroup>
                                    <SelectGroup className='mt-4'>
                                        <SelectLabel>NoSQL</SelectLabel>
                                        <SelectItem value='mongodb'>
                                            MongoDB
                                        </SelectItem>
                                    </SelectGroup>
                                    <SelectGroup className='mt-4'>
                                        <SelectLabel>Flatfile DB</SelectLabel>
                                        <SelectItem value='sqlite'>
                                            SQLite
                                        </SelectItem>
                                        <SelectItem value='json'>
                                            JSON
                                        </SelectItem>
                                        <SelectItem value='csv'>CSV</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='db_schema'
                    render={({ field }) => (
                        <FormItem className='row-span-2 grid grid-rows-[auto_1fr]'>
                            <div className='flex gap-2 items-center'>
                                <FormLabel>Schema:</FormLabel>
                                <FormDescription>
                                    The schema of the database you are using.
                                </FormDescription>
                            </div>
                            <Textarea
                                placeholder='Schema'
                                className='rezize-y'
                                {...field}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='input_format'
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex gap-2 items-center'>
                                <FormLabel>Input Format:</FormLabel>
                                <FormDescription>
                                    The format of the input data in JSON.
                                </FormDescription>
                            </div>
                            <Textarea
                                placeholder='Input Format'
                                className='resize-y'
                                {...field}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='output_format'
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex gap-2 items-center'>
                                <FormLabel>Output Format:</FormLabel>
                                <FormDescription>
                                    The format of the output data in JSON.
                                </FormDescription>
                            </div>
                            <Textarea
                                placeholder='Output Format'
                                className='resize-y'
                                {...field}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type='submit'
                    variant='outline'
                    className='col-span-2 place-self-center px-32 mt-8'>
                    Submit
                </Button>
            </form>
        </Form>
    );
};

export default SelectForm;
