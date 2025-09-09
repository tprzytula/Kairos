import { render, screen  } from "@testing-library/react"
import { FormFieldType } from "../../enums"
import { IFormField } from "../../types"
import { Select } from "."
import { IFieldProps } from "../../hooks/useForm/types"

describe("Given the Select component", () => {
    it("should render the component", () => {
        render(
            <Select
                field={EXAMPLE_FIELD}
                fieldProps={EXAMPLE_FIELD_PROPS}
                errors={EXAMPLE_ERRORS}
                isSubmitting={false}
            />
        )

        expect(screen.getAllByLabelText("Name")[0]).toBeVisible()
        expect(screen.getByText("units")).toBeVisible()
    })

    it("should render error message when there is an error", () => {
        render(
            <Select
                field={EXAMPLE_FIELD}
                fieldProps={EXAMPLE_FIELD_PROPS}
                errors={EXAMPLE_ERRORS}
                isSubmitting={false}
            />
        )

        expect(screen.getByText("Name is required")).toBeVisible()
    })

    it("should be disabled when isSubmitting is true", () => {
        render(
            <Select
                field={EXAMPLE_FIELD}
                fieldProps={EXAMPLE_FIELD_PROPS}
                errors={EXAMPLE_ERRORS}
                isSubmitting={true}
            />
        )

        expect(screen.getAllByLabelText("Name")[0]).toHaveAttribute("aria-invalid", "true")
    })
})

const EXAMPLE_FIELD: IFormField = {
    name: "name",
    label: "Name",
    type: FormFieldType.SELECT,
    value: "units",
    options: [
        {
            label: "units",
            value: "units"
        },
        {
            label: "kilograms",
            value: "kilograms"
        },
        {
            label: "liters",
            value: "liters"
        }
    ]
}

const EXAMPLE_FIELD_PROPS: IFieldProps = {
    onChange: jest.fn(),
    value: "units"
}

const EXAMPLE_ERRORS: Record<string, string> = {
    name: "Name is required"
}
