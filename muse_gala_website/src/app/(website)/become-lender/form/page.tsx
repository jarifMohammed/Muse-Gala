'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import AustraliaLocationSelector from '@/components/ui/australia-location-selector'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  becomeLenderForm,
  BecomeLenderFormType,
} from '@/types/become-lender-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm, FieldErrors } from 'react-hook-form'
import { toast } from 'sonner'

const mapboxtoken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!

const BecomeALenderForm = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [openAccordions, setOpenAccordions] = useState<string[]>(['item-1'])

  const form = useForm<BecomeLenderFormType>({
    resolver: zodResolver(becomeLenderForm),
    defaultValues: {
      businessName: '',
      abnNumber: '',
      instagramHandle: '',
      businessWebsite: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      businessAddress: '',
      numberOfDresses: '',

      reviewStockMethod: {
        website: true,
        instagram: false,
        keyBrands: true,
      },
      notes: '',
      allowLocalPickup: 'no',
      shipAustraliaWide: 'yes',
      allowTryOn: 'yes',
      agreedTerms: false,
      agreedCurationPolicy: false,
    },
  })

  const isAllowedLocalPickup = form.watch('allowLocalPickup').includes('yes')

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const value = form.watch('allowLocalPickup')

    if (value.includes('no')) {
      form.resetField('address', undefined)
      form.resetField('country', undefined)
      form.resetField('city', undefined)
      form.resetField('postcode', undefined)
      form.resetField('state', undefined)
      form.resetField('suburb', undefined)
      form.resetField('latitude', undefined)
      form.resetField('longitude', undefined)
      form.resetField('placeName', undefined)
    }
  }, [form])

  const { mutate, isPending } = useMutation({
    mutationKey: ['become-a-lender'],
    mutationFn: (values: BecomeLenderFormType) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/application/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.status) {
        toast.error(data.message || 'Something went wrong')
        return
      } else {
        setShowSuccessDialog(true)
        form.reset()
      }
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: BecomeLenderFormType) {
    // console.log(values, values.numberOfDresses);
    mutate(values)
  }

  // Handle scrolling to the first error when validation fails
  function onError(errors: FieldErrors<BecomeLenderFormType>) {
    // 1. Figure out which accordion sections contain errors
    const errorKeys = Object.keys(errors)
    const sectionsToOpen = new Set(openAccordions)

    const mapFieldToSection = (field: string) => {
      if (['businessName', 'abnNumber', 'instagramHandle', 'businessWebsite'].includes(field)) return 'item-1'
      if (['fullName', 'email', 'phoneNumber', 'businessAddress'].includes(field)) return 'item-2'
      if (['numberOfDresses', 'reviewStockMethod', 'notes'].includes(field)) return 'item-3'
      if (['allowLocalPickup', 'shipAustraliaWide', 'allowTryOn'].includes(field)) return 'item-4'
      return null
    }

    // Add all erroneous sections to open
    errorKeys.forEach((key) => {
      const section = mapFieldToSection(key)
      if (section) sectionsToOpen.add(section)
    })

    // 2. Open those sections
    setOpenAccordions(Array.from(sectionsToOpen))

    // 3. Wait for DOM to expand the accordions before scrolling
    setTimeout(() => {
      const firstError = errorKeys[0]
      if (firstError) {
        const errorElement = document.querySelector(`[name="${firstError}"]`) as HTMLElement
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          errorElement.focus?.()
        }
      }
    }, 150) // Short delay to allow Accordion to render its contents
  }
  return (
    <>
      <div className="my-20 container mx-auto">
        <div className="py-[25px] md:py-[38px] lg:py-[50px]">
          <h2 className="headerClass text-center">
            APPLY TO LEND WITH MUSE GALA
          </h2>
          <p className="brand-body text-center pt-[10px] md:pt-[13px] lg:pt-[15px]">
            Join Australia’s curated fashion rental platform. Showcase your
            collection, <br className="block md:hidden" /> expand your reach,
            and grow with us.
          </p>
        </div>
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onError)} className="">
              <Accordion
                type="multiple"
                value={openAccordions}
                onValueChange={setOpenAccordions}
              >
                {/* first  */}
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-xl font-avenir font-normal tracking-[0.2em] leading-[48px] uppercase">
                    BUSINESS INFORMATION
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                              Business Name{' '}
                              <sup className="pl-1 text-[#891D33]">*</sup>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="w-[90%] h-[40px]  border-t-0 border-l-0 border-r-0 border-b-[1.5px] border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2 shadow-none !text-lg  font-medium leading-normal text-black"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="py-[25px] md:py-[35px] lg:py-[45px]">
                      <FormField
                        control={form.control}
                        name="abnNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                              Business ABN{' '}
                              <span className="pl-4 md:pl-5 text-lg font-normal tracking-[0%] text-[#595959] font-avenir leading-[24px] ">
                                (if available)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="w-[90%] h-[40px]  border-t-0 border-l-0 border-r-0 border-b-[1.5px] border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2 shadow-none !text-lg  font-medium leading-normal text-black"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="instagramHandle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                              Instagram Handle{' '}
                              <sup className="pl-1 text-[#891D33]">*</sup>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="w-[90%] h-[40px]  border-t-0 border-l-0 border-r-0 border-b-[1.5px] border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2 shadow-none !text-lg  font-medium leading-normal text-black"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="pt-[25px] md:pt-[35px] lg:pt-[45px]">
                      <FormField
                        control={form.control}
                        name="businessWebsite"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                              Website
                              <span className="pl-4 md:pl-5 text-lg font-normal tracking-[0%] text-[#595959] font-avenir leading-[24px] ">
                                (if available)
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="w-[90%] h-[40px]  border-t-0 border-l-0 border-r-0 border-b-[1.5px] border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2 shadow-none !text-lg  font-medium leading-normal text-black"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {/* second  */}
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-xl font-avenir font-normal tracking-[0.2em] leading-[48px] uppercase">
                    Contact Information
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                              Full Name
                              <sup className="pl-1 text-[#891D33]">*</sup>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="w-[90%] h-[40px]  border-t-0 border-l-0 border-r-0 border-b-[1.5px] border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2 shadow-none !text-lg  font-medium leading-normal text-black"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="py-[25px] md:py-[35px] lg:py-[45px]">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                              Email Address
                              <sup className="pl-1 text-[#891D33]">*</sup>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="w-[90%] h-[40px]  border-t-0 border-l-0 border-r-0 border-b-[1.5px] border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2 shadow-none !text-lg  font-medium leading-normal text-black"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                              Phone Number
                              <sup className="pl-1 text-[#891D33]">*</sup>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="w-[90%] h-[40px]  border-t-0 border-l-0 border-r-0 border-b-[1.5px] border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2 shadow-none !text-lg  font-medium leading-normal text-black"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="businessAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                              Postal Address
                              <sup className="pl-1 text-[#891D33]">*</sup>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="w-[90%] h-[40px]  border-t-0 border-l-0 border-r-0 border-b-[1.5px] border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2 shadow-none !text-lg  font-medium leading-normal text-black "
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs font-avenir font-normal tracking-[0.05em] leading-[20px] text-[#595959] mt-1">
                              Used for internal purposes only and never shown to customers.
                            </p>
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {/* third  */}
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-xl font-avenir font-normal tracking-[0.2em] leading-[48px] uppercase">
                    Collection Overview
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <FormField
                        control={form.control}
                        name="numberOfDresses"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                              How many dresses do you want to list?
                              <sup className="pl-1 text-[#891D33]">*</sup>
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="w-[90%] h-[60px] border-t-0 border-l-0 border-r-0 border-b-[1.5px] border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 active-visible:ring-0 active-visible:ring-offset-0 focus:ring-0 focus:ring-none px-2 shadow-none !text-xl !md:text-2xl !tracking-[15%] font-medium leading-normal text-black">
                                  <SelectValue
                                    placeholder="Please Select"
                                    className="!text-xl !md:text-2xl font-normal font-avenir !tracking-[15%] leading-[28px] text-black"
                                  />
                                </SelectTrigger>
                                <SelectContent className="!text-xl !md:text-2xl font-normal font-avenir !tracking-[15%] leading-[28px] text-black">
                                  <SelectItem value="1-5">
                                    1-5 Dresses
                                  </SelectItem>
                                  <SelectItem value="5-15">
                                    5-15 Dresses
                                  </SelectItem>
                                  <SelectItem value="15-30">
                                    15-30 Dresses
                                  </SelectItem>
                                  <SelectItem value="30+">
                                    30+ Dresses
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="pt-[25px] md:pt-[35px] lg:pt-[45px]">
                      <FormField
                        control={form.control}
                        name="reviewStockMethod"
                        render={() => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                              Best way for us to review your stock
                              <sup className="pl-1 text-[#891D33]">*</sup>
                            </FormLabel>
                            <FormControl>
                              {/* Dropdown */}
                              <div className="relative">
                                <div
                                  onClick={toggleDropdown}
                                  className="w-[90%] flex justify-between items-center py-3 border-b border-black cursor-pointer"
                                >
                                  <span className="text-sm text-gray-700">
                                    Please select
                                  </span>
                                  <ChevronDown
                                    className={cn(
                                      'h-4 w-4 transition-transform',
                                      isOpen && 'rotate-180'
                                    )}
                                  />
                                </div>

                                {/* Dropdown content */}
                                {isOpen && (
                                  <div className="mt-6 space-y-5 ">
                                    {/* Website option */}
                                    <FormField
                                      control={form.control}
                                      name="reviewStockMethod.website"
                                      render={({ field }) => (
                                        <FormItem className="flex items-center space-x-3 m-0 p-0">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value}
                                              onCheckedChange={field.onChange}
                                              className="rounded-none border-black h-[18px] w-[18px] data-[state=checked]:bg-black data-[state=checked]:text-white mt-2"
                                            />
                                          </FormControl>
                                          <FormLabel className="text-sm font-normal mt-0 cursor-pointer">
                                            Website
                                          </FormLabel>
                                        </FormItem>
                                      )}
                                    />

                                    {/* Instagram option */}
                                    <FormField
                                      control={form.control}
                                      name="reviewStockMethod.instagram"
                                      render={({ field }) => (
                                        <FormItem className="flex items-start space-x-3 m-0 p-0">
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value}
                                              onCheckedChange={field.onChange}
                                              className="rounded-none border-black h-[18px] w-[18px] data-[state=checked]:bg-black data-[state=checked]:text-white mt-3"
                                            />
                                          </FormControl>
                                          <FormLabel className="text-sm font-normal mt-0 cursor-pointer">
                                            Instagram
                                          </FormLabel>
                                        </FormItem>
                                      )}
                                    />

                                    {/* Key brands option */}
                                    <div>
                                      <FormField
                                        control={form.control}
                                        name="reviewStockMethod.keyBrands"
                                        render={({ field }) => (
                                          <FormItem className=" flex items-start space-x-3 m-0 p-0">
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="rounded-none border-black h-[18px] w-[18px] data-[state=checked]:bg-black data-[state=checked]:text-white mt-3"
                                              />
                                            </FormControl>
                                            <div className="flex items-center">
                                              <FormLabel className=" text-sm font-normal mt-0 cursor-pointer inline-block">
                                                List your key brands
                                              </FormLabel>
                                              <span className="text-xs text-gray-500 ml-1">
                                                (Optional)
                                              </span>

                                              {form.watch('reviewStockMethod')
                                                ?.keyBrands && (
                                                  <div className=" flex items-center -mt-1">
                                                    <span className="mr-2 text-sm">
                                                      :
                                                    </span>
                                                    <FormField
                                                      control={form.control}
                                                      name="notes"
                                                      render={({ field }) => (
                                                        <FormItem className="w-full m-0 p-0 ">
                                                          <FormControl className="w-full">
                                                            <Input
                                                              {...field}
                                                              className="w-full md:w-[1032px] border-0 border-b border-black rounded-none p-0 h-7 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                                                            />
                                                          </FormControl>
                                                        </FormItem>
                                                      )}
                                                    />
                                                  </div>
                                                )}
                                            </div>
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {/* fourth part  */}
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-xl font-avenir font-normal tracking-[0.2em] leading-[48px] uppercase">
                    Service Questions
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <FormField
                        control={form.control}
                        name="allowLocalPickup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                              Do you offer local pickup?{' '}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex gap-10 md:gap-[50px] lg:gap-[60px] pt-2"
                              >
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl className="mt-3">
                                    <RadioGroupItem value="yes" />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                                    Yes
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl className="mt-3">
                                    <RadioGroupItem value="no" />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                                    No
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {isAllowedLocalPickup && (
                        <Card className="mt-10 shadow-none">
                          <CardHeader>
                            <CardTitle>Business Location Selector</CardTitle>
                            <CardDescription>
                              Select your business location using the
                              interactive map and search functionality
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <Label></Label>
                              <AustraliaLocationSelector
                                accessToken={mapboxtoken}
                                onLocationSelect={(data) => {
                                  form.setValue('address', data.address)
                                  form.setValue('country', data.country)
                                  form.setValue('city', data.city)
                                  form.setValue('postcode', data.postcode)
                                  form.setValue('state', data.state)
                                  form.setValue('suburb', data.suburb)
                                  form.setValue('latitude', data.latitude)
                                  form.setValue('longitude', data.longitude)
                                  form.setValue('placeName', data.placeName)
                                }}
                                placeholder="Search for your business location..."
                                mapHeight="300px"
                              />
                              <p className="text-xs font-avenir font-normal tracking-[0.05em] leading-[20px] text-[#595959] pt-1">
                                Shown to customers use a nearby landmark or approximate location for privacy.
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    <div className="py-[30px] md:py-[38px] lg:py-[45px]">
                      <FormField
                        control={form.control}
                        name="shipAustraliaWide"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                              Can you ship Australia-wide?
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex gap-10 md:gap-[50px] lg:gap-[60px] pt-2"
                              >
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl className="mt-3">
                                    <RadioGroupItem value="yes" />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                                    Yes
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl className="mt-3">
                                    <RadioGroupItem value="no" />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                                    No
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="allowTryOn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                              Do you offer try ons?
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex gap-10 md:gap-[50px] lg:gap-[60px] pt-2"
                              >
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl className="mt-3">
                                    <RadioGroupItem value="yes" />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                                    Yes
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                  <FormControl className="mt-3">
                                    <RadioGroupItem value="no" />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal font-avenir tracking-[15%] leading-[28px] text-black ">
                                    No
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="mt-[40px] md:mt-[70px] lg:mt-[100px]">
                <h5 className="text-[14px] md:text-xl  text-black tracking-[20%] uppercase leading-[48px] font-avenir border-b border-black">
                  Agreement
                </h5>
              </div>
              <div className="flex items-center gap-[20px] md:gap-[25px] py-[30px] md:py-[38px] lg:py-[45px]">
                <FormField
                  control={form.control}
                  name="agreedCurationPolicy"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="w-[20px] h-[20px]"
                        />
                      </FormControl>
                      <FormLabel className="text-base md:text-[14px] font-avenir font-normal leading-[24px] tracking-[0%] text-black">
                        I confirm that all dresses listed meet Muse Gala&apos;s
                        curation and quality standards.
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-[20px] md:gap-[25px]">
                <FormField
                  control={form.control}
                  name="agreedTerms"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="w-[20px] h-[20px]"
                        />
                      </FormControl>
                      <FormLabel className="text-base md:text-[14px] font-avenir font-normal leading-[24px] tracking-[0%] text-black">
                        I agree to Muse Gala&apos;s{' '}
                        <Link href={'/lender-terms-and-conditions'}>
                          <span className="text-[#891D33] underline">
                            Lender Terms & Conditions.
                          </span>
                        </Link>
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full flex justify-center items-center mt-[50px] md:mt-[70px] lg:mt-[110px] mb-[30px] md:mb-[40px] lg:mb-[50px]">
                <button
                  disabled={isPending}
                  className={cn(
                    'text-base font-normal font-avenir leading-[20px] tracking-[20%] uppercase text-black border-b border-black py-[10px]',
                    isPending && 'text-black/60'
                  )}
                  type="submit"
                >
                  {isPending ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md border-none shadow-2xl p-0 overflow-hidden rounded-none">
          <div className="bg-white p-8 text-center">
            <DialogHeader className="p-0 space-y-3">
              <DialogTitle className="text-2xl font-avenir font-medium tracking-tight text-center">
                Thank you for your submission.
              </DialogTitle>
              <DialogDescription className="text-sm font-avenir font-normal text-gray-500 text-center leading-relaxed">
                Your submission will be reviewed within 48 hours.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => setShowSuccessDialog(false)}
                className="w-full py-4 bg-black text-white font-avenir tracking-widest uppercase text-xs hover:bg-black/90 transition-colors rounded-none"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default BecomeALenderForm
